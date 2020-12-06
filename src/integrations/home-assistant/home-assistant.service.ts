/* eslint-disable @typescript-eslint/ban-types */
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Entity } from '../../entities/entity.dto';
import { Sensor } from '../../entities/sensor';
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
import { DISTRIBUTED_DEVICE_ID } from './home-assistant.const';
import { BinarySensor } from '../../entities/binary-sensor';
import { BinarySensorConfig } from './binary-sensor-config';
import { Switch } from '../../entities/switch';
import { SwitchConfig } from './switch-config';
import { DeviceTracker } from '../../entities/device-tracker';
import { DeviceTrackerConfig } from './device-tracker-config';
import { Camera } from '../../entities/camera';
import { CameraConfig } from './camera-config';
import { EntitiesService } from '../../entities/entities.service';

const PROPERTY_DENYLIST = ['component', 'configTopic', 'commandStore'];

@Injectable()
export class HomeAssistantService
  implements OnModuleInit, OnApplicationShutdown {
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
    private readonly entitiesService: EntitiesService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
    this.config = this.configService.get('homeAssistant');
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    this.device = await this.getDeviceInfo();

    try {
      this.mqttClient = await mqtt.connectAsync(
        this.config.mqttUrl,
        { ...this.config.mqttOptions },
        false
      );
      this.mqttClient.on('message', this.handleIncomingMessage.bind(this));
      this.mqttClient.on('connect', this.handleReconnect.bind(this));
      this.logger.log(
        `Successfully connected to MQTT broker at ${this.config.mqttUrl}`
      );

      this.emitter.on('newEntity', this.handleNewEntity.bind(this));
      this.emitter.on('stateUpdate', this.handleNewState.bind(this));
      this.emitter.on('attributesUpdate', this.handleNewAttributes.bind(this));
    } catch (e) {
      this.logger.error(e, e.stack);
    }
  }

  /**
   * Lifecycle hook, called once the application is shutting down.
   */
  async onApplicationShutdown(): Promise<void> {
    this.entityConfigs.forEach((config) => {
      if (
        config.device?.identifiers !== DISTRIBUTED_DEVICE_ID &&
        config.device?.viaDevice !== DISTRIBUTED_DEVICE_ID
      ) {
        this.logger.debug(`Marking ${config.uniqueId} as unavailable`);
        this.mqttClient.publish(
          config.availabilityTopic,
          config.payloadNotAvailable,
          {
            qos: 0,
            retain: true,
          }
        );
      }
    });
    return this.mqttClient?.end();
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

    if (entity.distributed) {
      config.device = new Device(DISTRIBUTED_DEVICE_ID);
      config.device.name = 'room-assistant hub';
    } else {
      config.device = this.device;
    }

    config = this.applyCustomizations(config, customizations);

    this.entityConfigs.set(combinedId, config);

    if (config instanceof DeviceTrackerConfig) {
      // auto discovery not supported by Home Assistant yet
      this.logger.log(
        `Device tracker requires manual setup in Home Assistant with topic: ${config.stateTopic}`
      );
    } else {
      // camera entities do not support stateTopic
      const message = this.formatMessage(
        config instanceof CameraConfig ? _.omit(config, ['stateTopic']) : config
      );

      this.logger.debug(
        `Registering entity ${config.uniqueId} under ${config.configTopic}`
      );
      this.mqttClient.publish(config.configTopic, JSON.stringify(message), {
        qos: 0,
        retain: true,
      });
    }

    this.mqttClient.publish(config.availabilityTopic, config.payloadAvailable, {
      qos: 0,
      retain: true,
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
    state: number | string | boolean | Buffer,
    distributed = false
  ): void {
    const config = this.entityConfigs.get(this.getCombinedId(id, distributed));
    if (config === undefined) {
      return;
    }

    this.logger.debug(`Sending new state ${state} for ${config.uniqueId}`);
    this.mqttClient.publish(
      config.stateTopic,
      state instanceof Buffer ? state : String(state),
      {
        qos: 0,
        retain: true,
      }
    );
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
    if (config === undefined || !this.config.sendAttributes) {
      return;
    }

    if (this.debounceFunctions.has(entityId)) {
      this.debounceFunctions.get(entityId)(attributes);
    } else {
      const debouncedFunc = _.debounce((attributes) => {
        this.logger.debug(
          `Sending new attributes ${JSON.stringify(attributes)} for ${
            config.uniqueId
          }`
        );
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
   * Executes a stored command based on the topic and content of a MQTT message.
   *
   * @param topic - Topic that the message was received on
   * @param message - Buffer containing the received message as a string
   */
  handleIncomingMessage(topic: string, message: Buffer): void {
    const configs = Array.from(this.entityConfigs.values());
    const config = configs.find(
      (config) => config instanceof SwitchConfig && config.commandTopic == topic
    );
    this.logger.debug(
      `Received message ${message.toString()} on ${topic} for ${
        config?.uniqueId
      }`
    );

    if (config instanceof SwitchConfig) {
      const command = message.toString();
      if (config.commandStore[command]) {
        config.commandStore[command]();
      }
    }
  }

  /**
   * Handles broker re-connection events.
   */
  protected handleReconnect(): void {
    this.logger.log('Re-connected to broker');
    this.entitiesService.refreshStates();
  }

  /**
   * Retrieves information about the local device.
   *
   * @returns Device information
   */
  protected async getDeviceInfo(): Promise<Device> {
    const instanceName = this.configService.get('global').instanceName;
    const systemInfo = await system();
    const serial =
      systemInfo.serial && systemInfo.serial !== '-'
        ? systemInfo.serial
        : makeId(instanceName);
    const device = new Device(serial);
    device.name = instanceName;
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
    } else if (entity instanceof BinarySensor) {
      return new BinarySensorConfig(combinedId, entity.name);
    } else if (entity instanceof Switch) {
      const config = new SwitchConfig(
        combinedId,
        entity.name,
        entity.turnOn.bind(entity),
        entity.turnOff.bind(entity)
      );
      this.mqttClient.subscribe(config.commandTopic, { qos: 0 });
      return config;
    } else if (entity instanceof Camera) {
      return new CameraConfig(combinedId, entity.name);
    } else if (entity instanceof DeviceTracker) {
      return new DeviceTrackerConfig(combinedId, entity.name);
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
      (value) => value.for.prototype instanceof EntityConfig
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
    const filteredMessage = _.omit(message, PROPERTY_DENYLIST);
    return this.deepMap(filteredMessage, (obj) => {
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
      _.mapValues(obj, (v) => {
        return _.isObject(v) && !_.isArray(v) ? this.deepMap(v, mapper) : v;
      })
    );
  }
}
