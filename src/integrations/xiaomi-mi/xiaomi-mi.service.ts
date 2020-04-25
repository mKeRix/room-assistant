import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit
} from '@nestjs/common';
import noble, { Peripheral, Advertisement } from '@abandonware/noble';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import { XiaomiMiConfig } from './xiaomi-mi.config';
import { makeId } from '../../util/id';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  SERVICE_DATA_UUID,
  ServiceData,
  Parser,
  Event,
  EventTypes
} from './parser';
import { Sensor } from '../../entities/sensor';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';

class SensorSet {
  private readonly name: string;
  private readonly entitiesService: EntitiesService;
  private measures: { [kind: string]: Sensor } = {};

  constructor(name: string, entitiesService: EntitiesService) {
    this.name = name;
    this.entitiesService = entitiesService;
  }

  recordMeasure(kind: string, units: string, state: number | string) {
    let sensor = this.measures[kind];
    if (!sensor) {
      const customizations: Array<EntityCustomization<any>> = [
        {
          for: SensorConfig,
          overrides: {
            deviceClass: kind,
            unitOfMeasurement: units
          }
        }
      ];
      const name = `${this.name} ${kind}`;
      const id = makeId(name);
      sensor = this.entitiesService.add(
        new Sensor(id, name),
        customizations
      ) as Sensor;
      this.measures[kind] = sensor;
    }
    sensor.state = state;
  }
}

@Injectable()
export class XiaomiMiService implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: XiaomiMiConfig;
  private readonly logger: Logger;
  private sensors: { [address: string]: SensorSet } = {};

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.config = this.configService.get('xiaomiMi');
    this.logger = new Logger(XiaomiMiService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    if (!this.hasSensors()) {
      this.logger.warn(
        'The addresses are empty, no sensors will be created! Please add some of the discovered IDs below to your configuration.'
      );
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.config.sensors.forEach(options => {
      this.sensors[options.address] = new SensorSet(
        options.name,
        this.entitiesService
      );
    });
    noble.on('stateChange', XiaomiMiService.handleStateChange);
    noble.on('discover', this.handleDiscovery.bind(this));
    noble.on('warning', this.onWarning.bind(this));
    this.logger.log('XiaomiMi Service bootstrapped!');
  }

  /**
   * Log warnings from noble.
   */
  onWarning(message: string): void {
    this.logger.warn('Warning: ', message);
  }

  /**
   * Determines whether we have any sensors.
   *
   * @returns Sensors status
   */
  hasSensors(): boolean {
    return this.config.sensors?.length > 0;
  }

  /**
   * Filters found BLE peripherals and publishes new readings to sensors, depending on configuration.
   *
   * @param peripheral - BLE peripheral
   */
  handleDiscovery(peripheral: Peripheral): void {
    const { advertisement, id } = peripheral || {};
    let sensorSet = this.sensors[id];
    if (!sensorSet) {
      return;
    }
    const buffer = this.getValidServiceData(advertisement);
    if (!buffer) {
      return;
    }
    const serviceData = this.parseServiceData(buffer);
    if (!serviceData) {
      return;
    }
    const event = serviceData.event;
    switch (serviceData.eventType) {
      case EventTypes.temperature: {
        sensorSet.recordMeasure('temperature', '°C', event.temperature);
        break;
      }
      case EventTypes.humidity: {
        sensorSet.recordMeasure('humidity', '%', event.humidity);
        break;
      }
      case EventTypes.battery: {
        this.logger.log(`Got battery: ${event.battery}`);
        sensorSet.recordMeasure('battery', '%', event.battery);
        break;
      }
      case EventTypes.temperatureAndHumidity: {
        this.logger.log(
          `Got temperature: ${event.temperature} and humidity: ${event.humidity}`
        );
        sensorSet.recordMeasure('temperature', '°C', event.temperature);
        sensorSet.recordMeasure('humidity', '%', event.humidity);
        break;
      }
      case EventTypes.illuminance: {
        this.logger.log(`Got illuminance: ${event.illuminance}`);
        break;
      }
      case EventTypes.moisture: {
        this.logger.log(`Got moisture: ${event.moisture}`);
        break;
      }
      case EventTypes.fertility: {
        this.logger.log(`Got fertility: ${event.fertility}`);
        break;
      }
      default: {
        this.logger.error(`Unknown event type: ${serviceData.eventType}`);
        break;
      }
    }
  }

  getValidServiceData(advertisement: Advertisement): Buffer {
    if (!advertisement || !advertisement.serviceData) {
      return null;
    }
    const uuidPair = advertisement.serviceData.find(
      data => data.uuid.toLowerCase() === SERVICE_DATA_UUID
    );
    if (!uuidPair) {
      return null;
    }
    return uuidPair.data;
  }

  parseServiceData(buffer: Buffer): ServiceData | null {
    try {
      return new Parser(buffer, null).parse();
    } catch (error) {
      this.logger.error(error);
    }
    return null;
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
