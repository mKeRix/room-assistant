/* eslint-disable @typescript-eslint/camelcase */
const mockMqttClient = {
  on: jest.fn(),
  publish: jest.fn(),
  end: jest.fn()
};

import { mocked } from 'ts-jest/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { HomeAssistantService } from './home-assistant.service';
import { ConfigModule } from '../../config/config.module';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import * as mqtt from 'async-mqtt';
import { system, Systeminformation } from 'systeminformation';
import SystemData = Systeminformation.SystemData;
import { SensorConfig } from './sensor-config';
import { Entity } from '../../entities/entity.entity';
import { Sensor } from '../../entities/sensor.entity';

jest.mock('async-mqtt', () => {
  return {
    connectAsync: jest.fn().mockReturnValue(mockMqttClient)
  };
});
jest.mock('systeminformation', () => {
  return {
    system: jest.fn().mockReturnValue({})
  };
});

describe('HomeAssistantService', () => {
  let service: HomeAssistantService;
  const emitter: EventEmitter = new EventEmitter();
  const mockMqtt = mocked(mqtt, true);
  const mockSystem = mocked(system);
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(emitter), ConfigModule],
      providers: [HomeAssistantService]
    }).compile();
    module.useLogger(loggerService);

    jest.clearAllMocks();

    service = module.get<HomeAssistantService>(HomeAssistantService);
  });

  it('should subscribe to entity events on init', () => {
    const emitterOnSpy = jest.spyOn(emitter, 'on');

    service.onModuleInit();
    expect(emitterOnSpy).toHaveBeenCalledWith(
      'newEntity',
      expect.any(Function)
    );
    expect(emitterOnSpy).toHaveBeenCalledWith(
      'stateUpdate',
      expect.any(Function)
    );
    expect(emitterOnSpy).toHaveBeenCalledWith(
      'attributesUpdate',
      expect.any(Function)
    );
  });

  it('should connect to MQTT on bootstrap', async () => {
    await service.onApplicationBootstrap();
    expect(mockMqtt.connectAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should get the device info on bootstrap', async () => {
    await service.onApplicationBootstrap();
    expect(mockSystem).toHaveBeenCalled();
  });

  it('should send offline messages for local entities on shutdown', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test', 'Test'));
    service.handleNewEntity(new Sensor('test2', 'Test 2'));
    mockMqttClient.publish.mockClear();

    await service.onApplicationShutdown();

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      expect.stringContaining('status'),
      'offline',
      {
        qos: 0,
        retain: true
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledTimes(2);
  });

  it('should not send offline messages for distributed entities', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('distributed', 'Dist', true));
    mockMqttClient.publish.mockClear();

    await service.onApplicationBootstrap();

    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });

  it('should terminate the MQTT connection gracefully on shutdown', async () => {
    await service.onApplicationBootstrap();
    await service.onApplicationShutdown();

    expect(mockMqttClient.end).toHaveBeenCalled();
  });

  it('should publish discovery configuration for a new sensor', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/sensor/room-assistant/test-instance-test-sensor/config',
      expect.any(String),
      {
        qos: 0,
        retain: true
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test-sensor/status',
      'online',
      {
        qos: 0,
        retain: true
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-instance-test-sensor',
      name: 'Test Sensor',
      state_topic: 'room-assistant/sensor/test-instance-test-sensor/state',
      json_attributes_topic:
        'room-assistant/sensor/test-instance-test-sensor/attributes',
      availability_topic:
        'room-assistant/sensor/test-instance-test-sensor/status'
    });
  });

  it('should publish discovery configuration for a new distributed sensor', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('dist-sensor', 'Dist Sensor', true));

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-dist-sensor',
      name: 'Dist Sensor',
      state_topic: 'room-assistant/sensor/dist-sensor/state',
      json_attributes_topic: 'room-assistant/sensor/dist-sensor/attributes',
      availability_topic: 'room-assistant/sensor/dist-sensor/status',
      device: {
        identifiers: 'room-assistant-distributed',
        name: 'room-assistant hub'
      }
    });
  });

  it('should include device information in the discovery message', async () => {
    mockSystem.mockResolvedValue({
      serial: 'abcd',
      model: 'Raspberry Pi',
      manufacturer: 'Foundation'
    } as SystemData);

    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('d6t-sensor', 'D6T Sensor'));

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      device: {
        identifiers: 'abcd',
        name: 'test-instance',
        model: 'Raspberry Pi',
        manufacturer: 'Foundation'
      }
    });
  });

  it('should apply sensor customizations to the discovery message', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('custom-sensor', 'Custom'), [
      {
        for: SensorConfig,
        overrides: {
          unitOfMeasurement: 'm',
          icon: 'mdi:distance'
        }
      }
    ]);

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unit_of_measurement: 'm',
      icon: 'mdi:distance'
    });
  });

  it('should exclude internal values from the discovery message', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));

    const configMsg = JSON.parse(mockMqttClient.publish.mock.calls[0][1]);
    expect(configMsg).not.toMatchObject({
      component: 'sensor'
    });
    expect(configMsg).not.toMatchObject({
      config_topic:
        'homeassistant/sensor/room-assistant/test-instance-test-sensor/config'
    });
  });

  it('should warn when the entity type cannot be matched for Home Assistant', () => {
    const fictitiousEntity = new (class extends Entity {})(
      'fictitious',
      'Mystery Entity'
    );
    service.handleNewEntity(fictitiousEntity);

    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('test-instance-fictitious'),
      expect.anything(),
      expect.anything()
    );
  });

  it('should publish state updates for entities', async () => {
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test', 'Test'));
    service.handleNewState('test', 2);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test/state',
      '2'
    );
  });

  it('should ignore state updates if the entity is not registered with Home Assistant', () => {
    service.handleNewState('does-not-exist', 'not_home');
    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });

  it('should publish attribute updates for entities', async () => {
    jest.useFakeTimers();
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test', 'Test'));
    service.handleNewAttributes('test', { stateUpdated: true });
    jest.runAllTimers();

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test/attributes',
      JSON.stringify({ state_updated: true })
    );
  });

  it('should debounce the attribute updates', async () => {
    jest.useFakeTimers();
    await service.onApplicationBootstrap();
    service.handleNewEntity(new Sensor('test', 'Test'));
    mockMqttClient.publish.mockClear();

    service.handleNewAttributes('test', { stateUpdated: true });
    service.handleNewAttributes('test', { stateUpdated: true, test: 1234 });
    jest.runAllTimers();

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test/attributes',
      JSON.stringify({ state_updated: true, test: 1234 })
    );
    expect(mockMqttClient.publish).toHaveBeenCalledTimes(1);
  });

  it('should ignore attribute updates if the entity is not registered with Home Assistant', () => {
    jest.useFakeTimers();
    service.handleNewAttributes('test', { stateUpdated: true });
    jest.runAllTimers();

    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });
});
