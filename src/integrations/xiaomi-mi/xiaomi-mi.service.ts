import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import noble, { Peripheral, Advertisement } from '@abandonware/noble';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import { XiaomiMiSensorOptions } from './xiaomi-mi.config';
import { makeId } from '../../util/id';
import { SERVICE_DATA_UUID, ServiceData, Parser, EventTypes } from './parser';
import { Sensor } from '../../entities/sensor';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';

@Injectable()
export class XiaomiMiService implements OnModuleInit, OnApplicationBootstrap {
  private config: { [address: string]: XiaomiMiSensorOptions } = {};
  private readonly logger: Logger;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService
  ) {
    this.logger = new Logger(XiaomiMiService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    this.config = {};
    this.configService.get('xiaomiMi').sensors.forEach((options) => {
      this.config[options.address] = options;
    });
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
    noble.on('stateChange', XiaomiMiService.handleStateChange);
    noble.on('discover', this.handleDiscovery.bind(this));
    noble.on('warning', this.onWarning.bind(this));
  }

  /**
   * Log warnings from noble.
   */
  private onWarning(message: string): void {
    this.logger.warn('Warning: ', message);
  }

  /**
   * Determines whether we have any sensors.
   *
   * @returns Sensors status
   */
  private hasSensors(): boolean {
    return Object.keys(this.config).length > 0;
  }

  /**
   * Record a measurement.
   *
   * @param devName - The name of the device that took the measurement.
   * @param kind - The kind of measurement.
   * @param units - The units of the measurement.
   * @param state - The current measurement.
   */
  private recordMeasure(
    devName: string,
    kind: string,
    units: string,
    state: number | string
  ): void {
    this.logger.debug(`${devName}: ${kind}: ${state}${units}`);
    const sensorName = `${devName} ${kind}`;
    const id = makeId(sensorName);
    let entity = this.entitiesService.get(id);
    if (!entity) {
      const customizations: Array<EntityCustomization<any>> = [
        {
          for: SensorConfig,
          overrides: {
            deviceClass: kind,
            unitOfMeasurement: units,
          },
        },
      ];
      entity = this.entitiesService.add(
        new Sensor(id, sensorName),
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
  handleDiscovery(peripheral: Peripheral): void {
    const { advertisement, id } = peripheral || {};
    const options = this.config[id];
    if (!options) {
      return;
    }
    const buffer = XiaomiMiService.getValidServiceData(advertisement);
    if (!buffer) {
      this.logger.warn(
        `${
          options.name
        } does not appear to be a Xiaomi device. Got advertisement ${JSON.stringify(
          advertisement
        )}`
      );
      return;
    }
    let serviceData: ServiceData | null = null;
    try {
      serviceData = XiaomiMiService.parseServiceData(buffer, options.bindKey);
    } catch (error) {
      this.logger.error(
        `${options.name}: couldn't parse service data: ${error}`
      );
      return;
    }
    if (!serviceData.frameControl.hasEvent) {
      this.logger.debug(
        `${options.name}: advertisement with no event: ${buffer.toString(
          'hex'
        )}`
      );
      return;
    }
    const event = serviceData.event;
    switch (serviceData.eventType) {
      case EventTypes.temperature: {
        this.recordMeasure(
          options.name,
          'temperature',
          '°C',
          event.temperature
        );
        break;
      }
      case EventTypes.humidity: {
        this.recordMeasure(options.name, 'humidity', '%', event.humidity);
        break;
      }
      case EventTypes.battery: {
        this.recordMeasure(options.name, 'battery', '%', event.battery);
        break;
      }
      case EventTypes.temperatureAndHumidity: {
        this.recordMeasure(
          options.name,
          'temperature',
          '°C',
          event.temperature
        );
        this.recordMeasure(options.name, 'humidity', '%', event.humidity);
        break;
      }
      case EventTypes.illuminance: {
        this.recordMeasure(
          options.name,
          'illuminance',
          'lx',
          event.illuminance
        );
        break;
      }
      case EventTypes.moisture: {
        this.recordMeasure(options.name, 'humidity', '%', event.moisture);
        break;
      }
      case EventTypes.fertility: {
        this.recordMeasure(options.name, null, 'µS/cm', event.fertility);
        break;
      }
      default: {
        this.logger.error(
          `${options.name}: unknown event type: ${serviceData.eventType}, ` +
            `raw data: ${buffer.toString('hex')}`
        );
        break;
      }
    }
  }

  /**
   * Extract service data.
   *
   * @returns The service data buffer for the Xiamoi service data UUID or null
   * if it doesn't exist.
   */
  private static getValidServiceData(
    advertisement: Advertisement
  ): Buffer | null {
    if (!advertisement || !advertisement.serviceData) {
      return null;
    }
    const uuidPair = advertisement.serviceData.find(
      (data) => data.uuid.toLowerCase() === SERVICE_DATA_UUID
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
   * Stops or starts BLE scans based on the adapter state.
   *
   * @param state - Noble adapter state string
   */
  private static handleStateChange(state: string): void {
    if (state === 'poweredOn') {
      noble.startScanning([], true);
    } else {
      noble.stopScanning();
    }
  }
}
