import { Sensor } from "../../entities/sensor";

const mockMqttClient = {
  on: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  end: jest.fn(),
};

import { ClusterService } from "../../cluster/cluster.service";
import { MqttService } from "./mqtt.service";
import { Test, TestingModule } from "@nestjs/testing";
import { NestEmitterModule } from "nest-emitter";
import { ConfigModule } from "../../config/config.module";
import { EntitiesModule } from "../../entities/entities.module";
import { EventEmitter } from "events";
import { EntitiesService } from "../../entities/entities.service";
import { ConfigService } from "../../config/config.service";
import c from "config";
import { MqttConfig } from "./mqtt.config";
import { mocked } from "ts-jest/utils";
import * as mqtt from "async-mqtt";
import { BinarySensor } from "../../entities/binary-sensor";
import { DeviceTracker } from "../../entities/device-tracker";
import { Switch } from "../../entities/switch";
import { Camera } from "../../entities/camera";
import { Entity } from "../../entities/entity.dto";

jest.mock('mdns', () => ({}), { virtual: true });
jest.mock('async-mqtt', () => {
  return {
    connectAsync: jest.fn().mockReturnValue(mockMqttClient),
  };
});
const mockMqtt = mocked(mqtt, true);

describe('MqttService', () => {
  let service: MqttService;
  let mockConfig: MqttConfig;
  const entitiesEmitter = new EventEmitter();
  const mqttEmitter = new EventEmitter();
  const entitiesService = {
    refreshStates: jest.fn(),
  };
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'mqtt' ? mockConfig : c.get(key);
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    entitiesEmitter.removeAllListeners();
    mqttEmitter.removeAllListeners();
    mockMqttClient.on.mockImplementation((event, callback) => {
      mqttEmitter.on(event, callback);
    });
    mockConfig = new MqttConfig();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestEmitterModule.forRoot(entitiesEmitter),
        ConfigModule,
        EntitiesModule,
      ],
      providers: [MqttService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(ClusterService)
      .useValue({})
      .compile();

    service = module.get<MqttService>(MqttService);
  })

  it('should subscribe to entity events on init', async () => {
    const emitterOnSpy = jest.spyOn(entitiesEmitter, 'on');

    await service.onModuleInit();
    expect(emitterOnSpy).toHaveBeenCalledWith(
      'entityUpdate',
      expect.any(Function)
    );
    expect(emitterOnSpy).toHaveBeenCalledWith(
      'entityRefresh',
      expect.any(Function)
    );
  });

  it('should connect to MQTT on init', async () => {
    await service.onModuleInit();
    expect(mockMqtt.connectAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      false
    );
  });

  it('should request an entity state refresh on broker reconnect', async () => {
    await service.onModuleInit();

    mqttEmitter.emit('connect');

    expect(entitiesService.refreshStates).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['sensor', new Sensor('test', 'Test')],
    ['binary-sensor', new BinarySensor('test', 'Test')],
    ['device-tracker', new DeviceTracker('test', 'Test')],
    ['switch', new Switch('test', 'Test')],
    ['camera', new Camera('test', 'Test')]
  ])("should post %s entity update messages", async (entityTopic: string, entity: Entity) => {
    const diff = [{
      newValue: 'new-state',
      oldValue: 'old-state',
      path: '/state'
    }];
    const hasAuthority = true;

    await service.onModuleInit();

    entitiesEmitter.emit('entityUpdate', entity, diff, hasAuthority);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      `room-assistant/entity/test-instance/${entityTopic}/${entity.id}`,
      JSON.stringify({ entity, diff, hasAuthority }),
      expect.any(Object)
    )
  });

  it.each([
    ['sensor', new Sensor('test', 'Test')],
    ['binary-sensor', new BinarySensor('test', 'Test')],
    ['device-tracker', new DeviceTracker('test', 'Test')],
    ['switch', new Switch('test', 'Test')],
    ['camera', new Camera('test', 'Test')]
  ])("should post %s entity refresh messages", async (entityTopic: string, entity: Entity) => {
    const hasAuthority = true;

    await service.onModuleInit();

    entitiesEmitter.emit('entityRefresh', entity, hasAuthority);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      `room-assistant/entity/test-instance/${entityTopic}/${entity.id}`,
      JSON.stringify({ entity, hasAuthority }),
      expect.any(Object)
    )
  });

  it("should use the configured base topic", async () => {
    mockConfig.baseTopic = 'my-new-topic';

    await service.onModuleInit();
    entitiesEmitter.emit('entityUpdate', new Sensor('test', 'Test'), [], true);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'my-new-topic/test-instance/sensor/test',
      expect.any(String),
      expect.any(Object)
    )
  });

  it("should pass the configured retain setting", async () => {
    mockConfig.retain = true;

    await service.onModuleInit();
    entitiesEmitter.emit('entityUpdate', new Sensor('test', 'Test'), [], true);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        retain: true
      })
    )
  });

  it("should pass the configured qos setting", async () => {
    mockConfig.qos = 2;

    await service.onModuleInit();
    entitiesEmitter.emit('entityUpdate', new Sensor('test', 'Test'), [], true);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        qos: 2
      })
    )
  });
})
