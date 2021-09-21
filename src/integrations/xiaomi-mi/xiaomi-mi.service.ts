import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Peripheral, Advertisement } from '@mkerix/noble';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import { XiaomiMiConfig, XiaomiMiSensorOptions } from './xiaomi-mi.config';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import { Device } from '../home-assistant/device';
import { makeId } from '../../util/id';
import { EventType, ProductId, ServiceData, Parser } from './parser';
import { Sensor } from '../../entities/sensor';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { BluetoothService } from '../../integration-support/bluetooth/bluetooth.service';
import { StateClass } from '../home-assistant/entity-config';

const SERVICE_DATA_UUID = 'fe95';
const SERVICE_BATTERY_UUID = '0000120400001000800000805f9b34fb';
const CHARACTERISTIC_BATTERY_UUID = '00001a0200001000800000805f9b34fb';

const BATTERY_QUERY_WINDOW = 60 * 60 * 1000; // Stagger battery queries to reduce adapter contention
const BATTERY_QUERY_INTERVAL = 23.5 * 60 * 60 * 1000; // Refresh battery level every 23.5-24.5 hours
const BATTERY_QUERY_ATTEMPTS = 3;

class SensorMetadata {
  name: string;
  deviceClass: string;
  stateClass?: StateClass;
  units: string;
}

const SensorMetadataList: { [index: number]: SensorMetadata } = {
  [EventType.temperature]: {
    name: 'Temperature',
    deviceClass: 'temperature',
    stateClass: StateClass.MEASUREMENT,
    units: '°C',
  },
  [EventType.humidity]: {
    name: 'Humidity',
    deviceClass: 'humidity',
    stateClass: StateClass.MEASUREMENT,
    units: '%',
  },
  [EventType.battery]: {
    name: 'Battery',
    deviceClass: 'battery',
    stateClass: StateClass.MEASUREMENT,
    units: '%',
  },
  [EventType.illuminance]: {
    name: 'Illuminance',
    deviceClass: 'illuminance',
    stateClass: StateClass.MEASUREMENT,
    units: 'lx',
  },
  [EventType.moisture]: {
    name: 'Moisture',
    deviceClass: undefined,
    stateClass: StateClass.MEASUREMENT,
    units: '%',
  },
  [EventType.fertility]: {
    name: 'Conductivity',
    deviceClass: undefined,
    stateClass: StateClass.MEASUREMENT,
    units: 'µS/cm',
  },
};

class BatterySchedule {
  nextQueryAfter: Date;
  attempts: number;
}

@Injectable()
export class XiaomiMiService implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger: Logger;
  private config: XiaomiMiConfig;
  private lastFrameSeen: number[] = [];
  private batterySchedule: BatterySchedule[] = [];

  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService
  ) {
    this.logger = new Logger(XiaomiMiService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    this.config = this.configService.get('xiaomiMi');

    if (!this.hasSensors()) {
      this.logger.warn(
        'No sensors entries in the config, so no sensors will be created! ' +
          'Enable the bluetooth-low-energy integration to log discovered IDs.'
      );
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.bluetoothService.onLowEnergyDiscovery(this.handleDiscovery.bind(this));
  }

  /**
   * Determines whether we have any sensors.
   *
   * @returns Sensors status
   */
  private hasSensors(): boolean {
    return this.config?.sensors?.length > 0;
  }

  /**
   * Record a measurement.
   *
   * @param device - The device and associated information that took the measurement.
   * @param sensor - The sensor meta-data including name, device class and units of measure.
   * @param state - The current measurement.
   */
  private recordMeasure(
    device: Device,
    sensor: SensorMetadata,
    state: number | string
  ): void {
    this.logger.debug(
      `${device.name}: ${sensor.name}: ${state}${sensor.units}`
    );
    const id = makeId(`xiaomi ${device.identifiers} ${sensor.name}`);
    let entity = this.entitiesService.get(id);
    if (!entity) {
      const customizations: Array<EntityCustomization<any>> = [
        {
          for: SensorConfig,
          overrides: {
            deviceClass: sensor.deviceClass,
            stateClass: sensor.stateClass,
            unitOfMeasurement: sensor.units,
            device: device,
          },
        },
      ];
      entity = this.entitiesService.add(
        new Sensor(id, `${device.name} ${sensor.name}`, true, false),
        customizations
      ) as Sensor;
    }
    entity.state = state;
  }

  /**
   * Filters found BLE peripherals and publishes new readings to sensors, depending on configuration.
   *
   * @param peripheral - BLE peripheral
   */
  async handleDiscovery(peripheral: Peripheral): Promise<void> {
    const sensorConfig = this.config?.sensors?.find(
      (el) => el.address === peripheral.id
    );
    if (!sensorConfig) {
      return;
    }

    const serviceData = this.parseAdvertisement(
      peripheral.advertisement,
      sensorConfig
    );
    if (!serviceData) {
      return;
    }

    if (this.lastFrameSeen[peripheral.id] == serviceData.frameCounter) {
      return;
    }
    this.lastFrameSeen[peripheral.id] = serviceData.frameCounter;

    const device: Device = {
      name: sensorConfig.name,
      manufacturer: 'Xiaomi',
      model: serviceData.productName,
      identifiers: peripheral.id,
      viaDevice: DISTRIBUTED_DEVICE_ID,
    };

    serviceData.events.forEach((event) => {
      const metadata = SensorMetadataList[event.type];
      if (metadata) {
        this.recordMeasure(device, metadata, event.value);
      } else {
        this.logger.error(
          `${sensorConfig.name}: unknown event type: ${serviceData.eventType}`
        );
      }
    });

    const checkBattery =
      sensorConfig.enableMifloraBattery ?? this.config.enableMifloraBattery;
    if (serviceData.productId == ProductId.HHCCJCV01 && checkBattery) {
      await this.checkMifloraBattery(peripheral, device);
    }
  }

  /**
   * Parse the advertisement data and extract sensor readings if available.
   *
   * @param advertisement - raw advertisement data
   * @param sensorConfig - sensor configuration settings
   */
  private parseAdvertisement(
    advertisement: Advertisement,
    sensorConfig: XiaomiMiSensorOptions
  ): ServiceData | null {
    const buffer = XiaomiMiService.findServiceData(
      advertisement,
      SERVICE_DATA_UUID
    );
    if (!buffer) {
      this.logger.debug(
        `${
          sensorConfig.name
        }: skipping message as supported data format not present: ${JSON.stringify(
          advertisement
        )}`
      );
      return null;
    }

    let serviceData: ServiceData | null = null;
    try {
      serviceData = XiaomiMiService.parseServiceData(
        buffer,
        sensorConfig.bindKey
      );
    } catch (error) {
      this.logger.error(
        `${sensorConfig.name}: skipping message as received data corrupt: ${error}`
      );
      return null;
    }

    if (!serviceData.frameControl.hasEvent) {
      this.logger.debug(
        `${
          sensorConfig.name
        }: skipping message as no sensor data provided: ${buffer.toString(
          'hex'
        )}`
      );
      return null;
    }

    return serviceData;
  }

  /**
   * Extract service data.
   *
   * @returns The service data buffer for the Xiamoi service data UUID or null
   * if it doesn't exist.
   */
  private static findServiceData(
    advertisement: Advertisement,
    suuid: string
  ): Buffer | null {
    if (!advertisement?.serviceData) {
      return null;
    }
    const uuidPair = advertisement.serviceData.find(
      (data) => data.uuid.toLowerCase() === suuid
    );
    if (!uuidPair) {
      return null;
    }
    return uuidPair.data;
  }

  /**
   * Parses the service data buffer.
   *
   * @param buffer - The servie data buffer.
   * @param bindKey - An optional bindKey for use in decripting the payload.
   *
   * @returns A ServiceData object.
   */
  private static parseServiceData(
    buffer: Buffer,
    bindKey: string | null
  ): ServiceData {
    return new Parser(buffer, bindKey).parse();
  }

  /**
   * Query the peripheral's battery service every 24 hours.
   *
   * @param peripheral - BLE peripheral
   * @param device - Device information
   */
  async checkMifloraBattery(
    peripheral: Peripheral,
    device: Device
  ): Promise<void> {
    if (!this.batterySchedule.hasOwnProperty(peripheral.id)) {
      this.batterySchedule[peripheral.id] = {
        nextQueryAfter: new Date(
          Date.now() + Math.random() * BATTERY_QUERY_WINDOW
        ),
        attempts: 0,
      };
    }

    const schedule: BatterySchedule = this.batterySchedule[peripheral.id];
    if (Date.now() > schedule.nextQueryAfter.getTime()) {
      let buffer: Buffer = null;

      if (!this.bluetoothService.acquireQueryMutex()) {
        this.logger.debug(
          `${device.name}: Canceled battery reading as BLE adapter is already in use`
        );
        return;
      }

      schedule.attempts += 1;
      try {
        buffer = await this.bluetoothService.queryLowEnergyDevice(
          peripheral,
          SERVICE_BATTERY_UUID,
          CHARACTERISTIC_BATTERY_UUID
        );
        if (!buffer) {
          throw new Error('data unavailable');
        }
      } catch (error) {
        this.logger.warn(
          `${device.name}: Error reading battery level (attempt ${schedule.attempts} of ${BATTERY_QUERY_ATTEMPTS}): ${error}`
        );
      }

      this.bluetoothService.releaseQueryMutex();

      if (buffer) {
        // buffer[0] -> battery level (0-100)
        // buffer[2:] -> device firmware version (e.g. "3.2.4")
        if (buffer.length > 2) {
          device.swVersion = buffer.toString('utf-8', 2);
        }

        this.recordMeasure(
          device,
          SensorMetadataList[EventType.battery],
          buffer[0]
        );
        this.logger.log(
          `${device.name}: Battery level updated to ${buffer[0]}%`
        );
      }

      if (buffer || schedule.attempts >= BATTERY_QUERY_ATTEMPTS) {
        schedule.nextQueryAfter = new Date(
          Date.now() +
            BATTERY_QUERY_INTERVAL +
            Math.random() * BATTERY_QUERY_WINDOW
        );
        schedule.attempts = 0;

        if (!buffer) {
          this.logger.error(
            `${device.name}: Battery query aborted after reaching maximum number of retries`
          );
        }
      }
    }
  }
}
