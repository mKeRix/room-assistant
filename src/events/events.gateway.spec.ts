import { EventsGateway } from './events.gateway';
import { EventEmitter } from 'events';
import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesModule } from '../entities/entities.module';
import { NestEmitterModule } from 'nest-emitter';
import { mocked } from 'ts-jest/utils';
import WebSocket from 'ws';
import { Sensor } from '../entities/sensor';
import { ClusterService } from '../cluster/cluster.service';

jest.mock('ws');
const mockWebSocket = mocked(WebSocket);

describe('Events Gateway', () => {
  let gateway: EventsGateway;
  const emitter = new EventEmitter();

  beforeEach(async () => {
    mockWebSocket.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(emitter), EntitiesModule],
      providers: [EventsGateway],
    })
      .overrideProvider(ClusterService)
      .useValue({})
      .compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should return success response for valid entity update subscription request', () => {
    const response = gateway.handleSubscriptionEvent(
      new WebSocket('ws://localhost'),
      {
        type: 'entityUpdates',
      }
    );

    expect(response.type).toBe('entityUpdates');
    expect(response.success).toBeTruthy();
    expect(response.details).toBeUndefined();
  });

  it('should send entity updates to subscribed sockets', () => {
    const entity = new Sensor('some-id', 'Name');
    const diff = [
      {
        newValue: 'new-state',
        oldValue: 'old-state',
        path: '/state',
      },
    ];
    const hasAuthority = true;

    gateway.onModuleInit();
    gateway.handleSubscriptionEvent(new WebSocket('ws://localhost'), {
      type: 'entityUpdates',
    });
    emitter.emit('entityUpdate', entity, diff, hasAuthority);

    const expectedMsg = JSON.stringify({
      entity,
      diff,
      hasAuthority,
    });
    expect(mockWebSocket.mock.instances[0].send).toHaveBeenCalledWith(
      expectedMsg
    );
  });

  it('should send data to disconnected sockets', () => {
    const socket = new WebSocket('ws://localhost');

    gateway.onModuleInit();
    gateway.handleSubscriptionEvent(socket, {
      type: 'entityUpdates',
    });
    gateway.handleDisconnect(socket);

    emitter.emit('entityUpdate', new Sensor('id', 'Name'), [], true);

    expect(mockWebSocket.mock.instances[0].send).not.toHaveBeenCalled();
  });
});
