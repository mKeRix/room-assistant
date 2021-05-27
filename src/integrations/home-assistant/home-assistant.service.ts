/* eslint-disable @typescript-eslint/ban-types */
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Entity } from '../../entities/entity.dto';
import { Sensor } from '../../entities/sensor';
import {
  AvailabilityStatus,
  EntityConfig,
  PROPERTY_DENYLIST,
} from './entity-config';
import { SensorConfig } from './sensor-config';
import * as _ from 'lodash';
import { ConfigService } from '../../config/config.service';
import mqtt, { AsyncMqttClient } from 'async-mqtt';
import { HomeAssistantConfig } from './home-assistant.config';
import { Device } from './device';
import { system } from 'systeminformation';
import { InjectEventEmitter } from 'nest-emitter';
import {
  EntitiesEventEmitter,
  PropertyDiff,
} from '../../entities/entities.events';
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
import { ClusterService } from '../../cluster/cluster.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Node } from 'democracy';

const INSTANCE_STATUS_BASE_TOPIC = 'room-assistant/status';

@Injectable()
export class HomeAssistantService
  implements OnModuleInit, OnApplicationShutdown
{
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
  private mqttClient?: AsyncMqttClient;
  private readonly statusTopic: string;
  private readonly logger: Logger = new Logger(HomeAssistantService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
    this.config = this.configService.get('homeAssistant');

    const instanceName = this.configService.get('global').instanceName;
    this.statusTopic = `${INSTANCE_STATUS_BASE_TOPIC}/${instanceName}`;
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    this.device = await this.getDeviceInfo();

    try {
      this.mqttClient = await mqtt.connectAsync(
        this.config.mqttUrl,
        {
          will: {
            topic: this.statusTopic,
            payload: 'offline',
            retain: false,
            qos: 1,
            properties: {
              willDelayInterval: 60,
            },
          },
          ...this.config.mqttOptions,
        },
        false
      );

      this.sendInstanceStatus();

      this.mqttClient.on('message', this.handleIncomingMessage.bind(this));
      this.mqttClient.on('error', (e) => this.logger.error(e.message, e.stack));
      this.mqttClient.on('connect', this.handleReconnect.bind(this));
      this.logger.log(
        `Successfully connected to MQTT broker at ${this.config.mqttUrl}`
      );

      this.emitter.on('newEntity', this.handleNewEntity.bind(this));
      this.emitter.on('entityUpdate', this.handleEntityUpdate.bind(this));
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }

    this.clusterService.on('elected', this.refreshEntities.bind(this));
    this.clusterService.on(
      'elected',
      this.updateDistributedAvailability.bind(this)
    );
    this.clusterService.on(
      'leader',
      this.updateDistributedAvailability.bind(this)
    );
  }

  /**
   * Lifecycle hook, called once the application is shutting down.
   */
  async onApplicationShutdown(): Promise<void> {
    await this.sendInstanceStatus('offline');

    const entityStatusUpdates = Array.from(this.entityConfigs.values())
      .filter(
        (config) =>
          (config.distributed && this.clusterService.isLeader()) ||
          !config.distributed
      )
      .map((config) => this.sendEntityStatus(config, 'offline'));
    await Promise.all(entityStatusUpdates);

    await this.mqttClient?.end();
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

    this.sendDiscoveryMessage(config);
    this.sendEntityStatus(config);
  }

  /**
   * Checks for relevant changes in the entity and informs Home Assistant
   * about them by sending new states and/or attributes to MQTT.
   *
   * @param entity - Updated entity
   * @param diff - Diff between old and new entity
   * @param hasAuthority - Whether this instance has control of the entity or not
   */
  handleEntityUpdate(
    entity: Entity,
    diff: Array<PropertyDiff>,
    hasAuthority: boolean
  ): void {
    const config = this.entityConfigs.get(
      this.getCombinedId(entity.id, entity.distributed)
    );
    if (config === undefined) {
      return;
    }

    if (hasAuthority) {
      if (diff.some((diff) => diff.path.startsWith('/state'))) {
        this.sendNewState(entity, config);
      }

      if (
        this.config.sendAttributes &&
        diff.some((diff) => diff.path.startsWith('/attributes'))
      ) {
        this.sendNewAttributes(entity, config);
      }

      if (
        this.config.sendMqttRoom &&
        diff.some((diff) => diff.path.startsWith('/distances/'))
      ) {
        this.sendNewMqttRoomDistances(entity.id, entity.name, diff);
      }
    }
  }

  /**
   * Send online status to own instance and entity availability topics.
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  sendHeartbeats(): void {
    this.sendInstanceStatus();
    this.entityConfigs.forEach((config) => {
      this.sendEntityStatus(config);
    });
  }

  /**
   * Re-publishes entity information that this instance has authority over
   * on a refresh (e.g. after MQTT re-connect).
   */
  refreshEntities(): void {
    this.logger.log('Refreshing entity states');

    this.entitiesService.getAll().forEach((entity) => {
      const config = this.entityConfigs.get(
        this.getCombinedId(entity.id, entity.distributed)
      );
      if (config === undefined) {
        return;
      }

      if (this.entitiesService.hasAuthorityOver(entity)) {
        this.sendNewState(entity, config);

        if (this.config.sendAttributes) {
          this.sendNewAttributes(entity, config);
        }
      }
    });
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
   * Checks if room-assistant is connected to the MQTT broker.
   */
  isConnected(): boolean {
    return this.mqttClient?.connected;
  }

  /**
   * Handles broker re-connection events.
   */
  protected handleReconnect(): void {
    this.logger.log('Re-connected to broker');
    this.sendHeartbeats();
    this.refreshEntities();
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
    let config: EntityConfig;

    if (entity instanceof Sensor) {
      config = new SensorConfig(combinedId, entity.name);
    } else if (entity instanceof BinarySensor) {
      config = new BinarySensorConfig(combinedId, entity.name);
    } else if (entity instanceof Switch) {
      config = new SwitchConfig(
        combinedId,
        entity.name,
        entity.turnOn.bind(entity),
        entity.turnOff.bind(entity)
      );
      this.mqttClient.subscribe((config as SwitchConfig).commandTopic, {
        qos: 0,
      });
    } else if (entity instanceof Camera) {
      config = new CameraConfig(combinedId, entity.name);
    } else if (entity instanceof DeviceTracker) {
      config = new DeviceTrackerConfig(combinedId, entity.name);
    } else {
      return;
    }

    config.distributed = entity.distributed;
    config.stateLocked = entity.stateLocked;
    config.setInstanceStatusTopic(
      `${INSTANCE_STATUS_BASE_TOPIC}/${
        this.clusterService.leader()?.id ||
        this.configService.get('global').instanceName
      }`
    );

    return config;
  }

  /**
   * Update distributed entities to reflect new leader in availability topics.
   * Run based on events from ClusterService.
   *
   * @param node - Node that is the new leader
   */
  private updateDistributedAvailability(node: Node) {
    Array.from(this.entityConfigs.values())
      .filter((config) => config.distributed && config.stateLocked)
      .forEach(async (config) => {
        config.setInstanceStatusTopic(
          `${INSTANCE_STATUS_BASE_TOPIC}/${node.id}`
        );

        if (this.clusterService.isLeader()) {
          await this.sendDiscoveryMessage(config);
          this.sendHeartbeats();
        }
      });
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
      if (!_.isObject(obj) || _.isArray(obj)) {
        return obj;
      }

      return _.mapKeys(obj, (v, k) => {
        return _.snakeCase(k);
      });
    });
  }

  /**
   * Publish entity status to its availability topic with MQTT.
   *
   * @param config - Config of the entity
   * @param status - Status that will be sent
   */
  private async sendEntityStatus(
    config: EntityConfig,
    status: AvailabilityStatus = 'online'
  ): Promise<void> {
    if (config.distributed && !config.stateLocked) {
      return;
    }

    this.logger.debug(`Marking ${config.uniqueId} as ${status}`);
    await this.mqttClient?.publish(config.availability[0].topic, status);
  }

  /**
   * Publish instance status to the availability topic with MQTT.
   *
   * @param status - Status that will be sent
   */
  private async sendInstanceStatus(
    status: AvailabilityStatus = 'online'
  ): Promise<void> {
    this.logger.debug(`Marking instance as ${status}`);
    await this.mqttClient?.publish(this.statusTopic, status, {
      qos: 1,
    });
  }

  /**
   * Publish Home Assistant auto-discovery message for an entity with MQTT.
   *
   * @param config - Entity config to publish for discovery
   */
  private async sendDiscoveryMessage(config: EntityConfig): Promise<void> {
    if (
      config.distributed &&
      config.stateLocked &&
      !this.clusterService.isLeader()
    ) {
      return;
    }

    // camera entities do not support stateTopic
    const message = this.formatMessage(
      config instanceof CameraConfig
        ? _.omit(config.shallowClone(), ['stateTopic'])
        : config.shallowClone()
    );

    // concatenate discoveryPrefix to configTopic
    const discoveryTopic =
      this.config.discoveryPrefix + '/' + config.configTopic;

    this.logger.debug(
      `Registering entity ${config.uniqueId} under ${discoveryTopic}`
    );
    await this.mqttClient?.publish(discoveryTopic, JSON.stringify(message), {
      qos: 0,
      retain: true,
    });
  }

  /**
   * Sends information about entity state changes to Home Assistant.
   *
   * @param entity - Entity with a new state
   * @param config - Entity config of the passed entity
   */
  private sendNewState(entity: Entity, config: EntityConfig): void {
    const logState = entity.state instanceof Buffer ? '<binary>' : entity.state;
    this.logger.debug(`Sending new state ${logState} for ${config.uniqueId}`);

    this.mqttClient.publish(
      config.stateTopic,
      entity.state instanceof Buffer ? entity.state : String(entity.state),
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
   * @param entity - Entity with new attributes
   * @param config - Entity config of the passed entity
   */
  private sendNewAttributes(entity: Entity, config: EntityConfig): void {
    if (this.debounceFunctions.has(entity.id)) {
      this.debounceFunctions.get(entity.id)(entity.attributes);
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
      this.debounceFunctions.set(entity.id, debouncedFunc);
      debouncedFunc(entity.attributes);
    }
  }

  /**
   * Sends information about distances included in the diff to
   * Home Assistant in the MQTT Room format. Useful for
   * combining room-assistant tracking with other projects,
   * e.g. ESPHome.
   *
   * @param id - ID of device to be sent
   * @param name - Name of the device to be sent
   * @param diff - Diff including changes to the /distances/* paths
   */
  private sendNewMqttRoomDistances(
    id: string,
    name: string,
    diff: PropertyDiff[]
  ) {
    diff
      .filter((value) => value.path.startsWith('/distances/'))
      .forEach((value) => {
        const room = value.path.split('/')[2];
        this.mqttClient.publish(
          `${this.config.mqttRoomPrefix}/${room}`,
          JSON.stringify({
            id,
            name,
            distance: value.newValue.distance,
          })
        );
      });
  }

  /**
   * Maps values of an object in a recursive manner.
   *
   * @param obj - Object to map
   * @param mapper - Function to apply to all items
   */
  private deepMap(obj: object, mapper: (v: object) => object): object {
    const mappingMethod: (
      obj: object,
      callback: (v: object) => object
    ) => object = _.isArray(obj) ? _.map : _.mapValues;

    return mapper(
      mappingMethod(obj, (v) => {
        if (_.isArray(v)) {
          return [...v].map((e) => this.deepMap(e, mapper));
        } else if (_.isObject(v)) {
          return this.deepMap(v, mapper);
        } else {
          return v;
        }
      })
    );
  }
}
