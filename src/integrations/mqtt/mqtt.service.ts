import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EntitiesService } from '../../entities/entities.service';
import { InjectEventEmitter } from 'nest-emitter';
import {
  EntitiesEventEmitter,
  PropertyDiff,
} from '../../entities/entities.events';
import { MqttConfig } from './mqtt.config';
import mqtt, { AsyncMqttClient } from 'async-mqtt';
import { Entity } from '../../entities/entity.dto';
import { makeId } from '../../util/id';
import _ from 'lodash';
import { ClusterService } from '../../cluster/cluster.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private config: MqttConfig;
  private mqttClient: AsyncMqttClient;
  private readonly logger: Logger = new Logger(MqttService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
    this.config = configService.get('mqtt');
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    try {
      this.mqttClient = await mqtt.connectAsync(
        this.config.mqttUrl,
        { ...this.config.mqttOptions },
        false
      );

      this.mqttClient.on('error', (e) => this.logger.error(e.message, e.stack));
      this.mqttClient.on('connect', this.handleReconnect.bind(this));
      this.logger.log(
        `Successfully connected to MQTT broker at ${this.config.mqttUrl}`
      );

      this.emitter.on('entityUpdate', this.handleEntityUpdate.bind(this));
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }

    this.clusterService.on('elected', this.refreshEntities.bind(this));
  }

  /**
   * Checks if room-assistant is connected to the MQTT broker.
   */
  isConnected(): boolean {
    return this.mqttClient?.connected;
  }

  /**
   * Resends all entity information to MQTT broker, e.g. after a re-connect.
   */
  refreshEntities(): void {
    this.logger.log('Refreshing entity states');

    this.entitiesService.getAll().forEach((entity) => {
      this.handleEntityUpdate(
        entity,
        undefined,
        this.entitiesService.hasAuthorityOver(entity)
      );
    });
  }

  /**
   * Passes entity updates to the MQTT broker.
   *
   * @param entity - Entity in its updated state
   * @param diff - Difference between old and new state
   * @param hasAuthority - Whether this instance has control of the entity or not
   */
  private handleEntityUpdate(
    entity: Entity,
    diff: Array<PropertyDiff>,
    hasAuthority: boolean
  ): void {
    const message: EntityUpdateMessage = {
      entity,
      diff,
      hasAuthority,
    };
    this.mqttClient.publish(
      this.getTopicName(entity),
      JSON.stringify(message),
      {
        qos: this.config.qos,
        retain: this.config.retain,
      }
    );
  }

  /**
   * Handles broker re-connection events.
   */
  private handleReconnect(): void {
    this.logger.log('Re-connected to broker');
    this.refreshEntities();
  }

  /**
   * Generates a unique topic name from an entity.
   *
   * @param entity - Entity that the topic should contain
   */
  private getTopicName(entity: Entity) {
    return `${this.config.baseTopic}/${makeId(
      this.configService.get('global').instanceName
    )}/${_.kebabCase(entity.constructor.name)}/${makeId(entity.id)}`;
  }
}

interface EntityUpdateMessage {
  entity: Entity;
  diff?: Array<PropertyDiff>;
  hasAuthority: boolean;
}
