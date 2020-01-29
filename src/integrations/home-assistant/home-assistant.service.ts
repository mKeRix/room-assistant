import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleInit
} from '@nestjs/common';
import { Entity } from '../../entities/entity.entity';
import { Sensor } from '../../entities/sensor.entity';
import { EntityConfig } from './entity-config';
import { SensorConfig } from './sensor-config';
import * as _ from 'lodash';
import { ConfigService } from '../../config/config.service';
import mqtt, { AsyncMqttClient } from 'async-mqtt';
import { HomeAssistantConfig } from './home-assistant.config';
import { Device } from './device';
import { system } from 'systeminformation';
import { InjectEventEmitter } from 'nest-emitter';
import { EntitiesEventEmitter } from '../../entities/entities.events';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { makeId } from '../../util/id';

const PROPERTY_BLACKLIST = ['component', 'configTopic'];

@Injectable()
export class HomeAssistantService
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
  private config: HomeAssistantConfig;
  private device: Device;
  private entityConfigs: Map<string, EntityConfig> = new Map<
    string,
    EntityConfig
  >();
  private debounceFunctions = new Map<
    string,
    (attributes: { [key: string]: any }) => void
  >();
  private mqttClient: AsyncMqttClient;
  private readonly logger: Logger = new Logger(HomeAssistantService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
    this.config = this.configService.get('homeAssistant');
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    this.emitter.on('newEntity', this.handleNewEntity.bind(this));
    this.emitter.on('stateUpdate', this.handleNewState.bind(this));
    this.emitter.on('attributesUpdate', this.handleNewAttributes.bind(this));
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.mqttClient = await mqtt.connectAsync(
      this.config.mqttUrl,
      this.config.mqttOptions
    );
    this.mqttClient.on('connect', () =>
      this.logger.log(`Connected to ${this.config.mqttUrl}`)
    );

    this.device = await this.getDeviceInfo();
  }

  /**
   * Lifecycle hook, called once the application is shutting down.
   */
  async onApplicationShutdown(): Promise<void> {
    this.entityConfigs.forEach(config => {
      if (config.device.identifiers !== 'room-assistant-distributed') {
        this.mqttClient.publish(
          config.availabilityTopic,
          config.payloadNotAvailable,
          {
            qos: 0,
            retain: true
          }
        );
      }
    });
    return this.mqttClient.end();
  }

  /**
   * Sends information about a new entity to Home Assistant.
   *
   * @param entity - Entity to register
   * @param customizations - Customizations for the discovery objects
   */
  handleNewEntity(
    entity: Entity,
    customizations: Array<EntityCustomization<any>> = []
  ): void {
    const combinedId = this.getCombinedId(entity.id, entity.distributed);
    let config = this.generateEntityConfig(combinedId, entity);
    if (config === undefined) {
      this.logger.warn(
        `${combinedId} cannot be matched to a Home Assistant type and will not be transferred`
      );
      return;
    }

    config = this.applyCustomizations(config, customizations);
    if (entity.distributed) {
      config.device = new Device('room-assistant-distributed');
      config.device.name = 'room-assistant hub';
    } else {
      config.device = this.device;
    }

    this.entityConfigs.set(combinedId, config);
    this.mqttClient.publish(
      config.configTopic,
      JSON.stringify(this.formatMessage(config)),
      {
        qos: 0,
        retain: true
      }
    );
    this.mqttClient.publish(config.availabilityTopic, config.payloadAvailable, {
      qos: 0,
      retain: true
    });
  }

  /**
   * Sends information about entity state changes to Home Assistant.
   *
   * @param id - ID of the entity that had its state updated
   * @param state - New state of the entity
   * @param distributed - Whether the entity is a distributed one or not
   */
  handleNewState(
    id: string,
    state: number | string | boolean,
    distributed = false
  ): void {
    const config = this.entityConfigs.get(this.getCombinedId(id, distributed));
    if (config === undefined) {
      return;
    }

    this.mqttClient.publish(config.stateTopic, String(state));
  }

  /**
   * Sends information about attribute state changes to Home Assistant.
   * Updates are debounced and will only be sent on the next tick.
   *
   * @param entityId - ID of the entity that had its attributes updated
   * @param attributes - All current attributes of the entity
   * @param distributed - Whether the entity is a distributed one or not
   */
  handleNewAttributes(
    entityId: string,
    attributes: { [key: string]: any },
    distributed = false
  ): void {
    const config = this.entityConfigs.get(
      this.getCombinedId(entityId, distributed)
    );
    if (config === undefined) {
      return;
    }

    if (this.debounceFunctions.has(entityId)) {
      this.debounceFunctions.get(entityId)(attributes);
    } else {
      const debouncedFunc = _.debounce(attributes => {
        this.mqttClient.publish(
          config.jsonAttributesTopic,
          JSON.stringify(this.formatMessage(attributes))
        );
      });
      this.debounceFunctions.set(entityId, debouncedFunc);
      debouncedFunc(attributes);
    }
  }

  /**
   * Retrieves information about the local device.
   *
   * @returns Device information
   */
  protected async getDeviceInfo(): Promise<Device> {
    const systemInfo = await system();
    const device = new Device(systemInfo.serial);
    device.name = this.configService.get('global').instanceName;
    device.model = systemInfo.model;
    device.manufacturer = systemInfo.manufacturer;
    return device;
  }

  /**
   * Generates a Home Assistant ID.
   *
   * @param entityId - ID of the entity
   * @param distributed - Whether the entity is distributed or not
   * @returns ID to be used for the entity in Home Assistant
   */
  protected getCombinedId(entityId: string, distributed = false): string {
    return makeId(
      distributed
        ? entityId
        : [this.configService.get('global').instanceName, entityId].join('-')
    );
  }

  /**
   * Generates a Home Assistant config for a local entity.
   *
   * @param combinedId - Home Assistant ID
   * @param entity - Entity that the configuration should be generated for
   * @returns Entity configuration for Home Assistant
   */
  protected generateEntityConfig(
    combinedId: string,
    entity: Entity
  ): EntityConfig {
    if (entity instanceof Sensor) {
      return new SensorConfig(combinedId, entity.name);
    } else {
      return;
    }
  }

  /**
   * Picks and applies relevant customizations to a Home Assistant entity configuration.
   *
   * @param config - Existing entity configuration
   * @param customizations - Customizations for the configuration
   * @returns Customized configuration
   */
  protected applyCustomizations(
    config: EntityConfig,
    customizations: Array<EntityCustomization<any>>
  ): EntityConfig {
    const customization = customizations.find(
      value => value.for.prototype instanceof EntityConfig
    );
    if (customization !== undefined) {
      Object.assign(config, customization.overrides);
    }

    return config;
  }

  /**
   * Formats a message to be in the Home Assistant format.
   *
   * @param message - Message to be sent
   * @returns Formatted message
   */
  protected formatMessage(message: object): object {
    const filteredMessage = _.omit(message, PROPERTY_BLACKLIST);
    return this.deepMap(filteredMessage, obj => {
      return _.mapKeys(obj, (v, k) => {
        return _.snakeCase(k);
      });
    });
  }

  /**
   * Maps values of an object in a recursive manner.
   *
   * @param obj - Object to map
   * @param mapper - Function to apply to all items
   */
  private deepMap(obj: object, mapper: (v: object) => object): object {
    return mapper(
      _.mapValues(obj, v => {
        return _.isObject(v) && !_.isArray(v) ? this.deepMap(v, mapper) : v;
      })
    );
  }
}
