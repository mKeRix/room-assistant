import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import WebSocket from 'ws';
import { InjectEventEmitter } from 'nest-emitter';
import {
  EntitiesEventEmitter,
  PropertyDiff,
} from '../entities/entities.events';
import { OnModuleInit } from '@nestjs/common';
import { Entity } from '../entities/entity.dto';

type SubscriptionType = 'entityUpdates';

interface SubscriptionRequest {
  type: SubscriptionType;
}

interface SubscriptionResult {
  type: SubscriptionType;
  success: boolean;
  details?: string;
}

interface EntityUpdate {
  entity: Entity;
  diff: Array<PropertyDiff>;
  hasAuthority: boolean;
}

@WebSocketGateway()
export class EventsGateway implements OnModuleInit, OnGatewayDisconnect {
  private readonly subscribedSockets: Set<WebSocket> = new Set();

  constructor(
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {}

  onModuleInit(): void {
    this.emitter.on('entityUpdate', this.handleEntityUpdate.bind(this));
  }

  handleDisconnect(client: WebSocket): void {
    this.subscribedSockets.delete(client);
  }

  @SubscribeMessage('subscribeEvents')
  handleSubscriptionEvent(
    client: WebSocket,
    data: SubscriptionRequest
  ): SubscriptionResult {
    if (data.type !== 'entityUpdates') {
      return {
        type: data.type,
        success: false,
        details: 'Requested subscription type is not supported',
      };
    }

    this.subscribedSockets.add(client);
    return {
      type: data.type,
      success: true,
    };
  }

  private handleEntityUpdate(
    entity: Entity,
    diff: Array<PropertyDiff>,
    hasAuthority: boolean
  ): void {
    const update: EntityUpdate = {
      entity,
      diff,
      hasAuthority,
    };
    const updateMsg = JSON.stringify(update);

    this.subscribedSockets.forEach((socket) => {
      socket.send(updateMsg);
    });
  }
}
