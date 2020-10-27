const mockMqttClient = {
  on: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  end: jest.fn(),
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
import { Entity } from '../../entities/entity.dto';
import { Sensor } from '../../entities/sensor';
import { BinarySensor } from '../../entities/binary-sensor';
import { Switch } from '../../entities/switch';
import { DeviceTracker } from '../../entities/device-tracker';
import { Camera } from '../../entities/camera';
import { DISTRIBUTED_DEVICE_ID } from './home-assistant.const';
import { EntitiesModule } from '../../entities/entities.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';

jest.mock('async-mqtt', () => {
  return {
    connectAsync: jest.fn().mockReturnValue(mockMqttClient),
  };
});
jest.mock('systeminformation', () => {
  return {
    system: jest.fn().mockReturnValue({}),
  };
});

describe('HomeAssistantService', () => {
  let service: HomeAssistantService;
  let emitter: EventEmitter;
  const mockMqtt = mocked(mqtt, true);
  const mockSystem = mocked(system);
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };
  const entitiesService = {
    refreshStates: jest.fn(),
  };
  const clusterService = {};

  beforeEach(async () => {
    emitter = new EventEmitter();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestEmitterModule.forRoot(emitter),
        ConfigModule,
        EntitiesModule,
      ],
      providers: [HomeAssistantService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();
    module.useLogger(loggerService);

    jest.clearAllMocks();

    service = module.get<HomeAssistantService>(HomeAssistantService);
  });

  it('should subscribe to entity events on init', async () => {
    const emitterOnSpy = jest.spyOn(emitter, 'on');

    await service.onModuleInit();
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

  it('should connect to MQTT on init', async () => {
    await service.onModuleInit();
    expect(mockMqtt.connectAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      false
    );
    expect(mockMqttClient.on).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
  });

  it('should get the device info on init', async () => {
    await service.onModuleInit();
    expect(mockSystem).toHaveBeenCalled();
  });

  it('should request an entity state refresh on broker reconnect', async () => {
    const mqttEmitter = new EventEmitter();
    mockMqttClient.on.mockImplementation((event, callback) => {
      mqttEmitter.on(event, callback);
    });
    await service.onModuleInit();

    mqttEmitter.emit('connect');

    expect(entitiesService.refreshStates).toHaveBeenCalledTimes(1);
  });

  it('should send offline messages for local entities on shutdown', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test', 'Test'));
    service.handleNewEntity(new Sensor('test2', 'Test 2'));
    mockMqttClient.publish.mockClear();

    await service.onApplicationShutdown();

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      expect.stringContaining('status'),
      'offline',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledTimes(2);
  });

  it('should not send offline messages for distributed entities', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test-sensor', 'Dist', true));
    mockMqttClient.publish.mockClear();

    await service.onApplicationShutdown();

    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });

  it('should not send offline messages for entities belong to a child device of the distributed hub', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test-sensor', 'Dist', true), [
      {
        for: SensorConfig,
        overrides: {
          device: {
            identifiers: 'test-device-id',
            viaDevice: DISTRIBUTED_DEVICE_ID,
          },
        },
      },
    ]);
    mockMqttClient.publish.mockClear();

    await service.onApplicationShutdown();

    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });

  it('should terminate the MQTT connection gracefully on shutdown', async () => {
    await service.onModuleInit();
    await service.onApplicationShutdown();

    expect(mockMqttClient.end).toHaveBeenCalled();
  });

  it('should publish discovery configuration for a new sensor', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/sensor/room-assistant/test-instance-test-sensor/config',
      expect.any(String),
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test-sensor/status',
      'online',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-instance-test-sensor',
      name: 'Test Sensor',
      state_topic: 'room-assistant/sensor/test-instance-test-sensor/state',
      json_attributes_topic:
        'room-assistant/sensor/test-instance-test-sensor/attributes',
      availability_topic:
        'room-assistant/sensor/test-instance-test-sensor/status',
    });
  });

  it('should publish discovery configuration for a new distributed sensor', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('dist-sensor', 'Dist Sensor', true));

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-dist-sensor',
      name: 'Dist Sensor',
      state_topic: 'room-assistant/sensor/dist-sensor/state',
      json_attributes_topic: 'room-assistant/sensor/dist-sensor/attributes',
      availability_topic: 'room-assistant/sensor/dist-sensor/status',
      device: {
        identifiers: 'room-assistant-distributed',
        name: 'room-assistant hub',
      },
    });
  });

  it('should publish configuration for a new binary sensor', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new BinarySensor('bin-sensor', 'Binary'));

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/binary_sensor/room-assistant/test-instance-bin-sensor/config',
      expect.any(String),
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/binary_sensor/test-instance-bin-sensor/status',
      'online',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-instance-bin-sensor',
      name: 'Binary',
      state_topic:
        'room-assistant/binary_sensor/test-instance-bin-sensor/state',
      json_attributes_topic:
        'room-assistant/binary_sensor/test-instance-bin-sensor/attributes',
      availability_topic:
        'room-assistant/binary_sensor/test-instance-bin-sensor/status',
      payload_on: 'true',
      payload_off: 'false',
    });
  });

  it('should publish discovery information for a new switch', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Switch('test-switch', 'Test Switch'));

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/switch/room-assistant/test-instance-test-switch/config',
      expect.any(String),
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/switch/test-instance-test-switch/status',
      'online',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-instance-test-switch',
      name: 'Test Switch',
      state_topic: 'room-assistant/switch/test-instance-test-switch/state',
      command_topic: 'room-assistant/switch/test-instance-test-switch/command',
      json_attributes_topic:
        'room-assistant/switch/test-instance-test-switch/attributes',
      availability_topic:
        'room-assistant/switch/test-instance-test-switch/status',
      payload_on: 'on',
      payload_off: 'off',
      state_on: 'true',
      state_off: 'false',
    });
  });

  it('should subscribe to the command topic when registering a new switch', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Switch('test-switch', 'Test Switch'));

    expect(
      mockMqttClient.subscribe
    ).toHaveBeenCalledWith(
      'room-assistant/switch/test-instance-test-switch/command',
      { qos: 0 }
    );
  });

  it('should publish discovery information for a new device tracker', async () => {
    await service.onModuleInit();
    service.handleNewEntity(
      new DeviceTracker('test-tracker', 'Test Tracker', true)
    );

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/device_tracker/room-assistant/test-tracker/config',
      expect.any(String),
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/device_tracker/test-tracker/status',
      'online',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-tracker',
      name: 'Test Tracker',
      state_topic: 'room-assistant/device_tracker/test-tracker/state',
      json_attributes_topic:
        'room-assistant/device_tracker/test-tracker/attributes',
      availability_topic: 'room-assistant/device_tracker/test-tracker/status',
      payload_home: 'home',
      payload_not_home: 'not_home',
    });
  });

  it('should publish discovery information for a new camera', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Camera('test-camera', 'Test Camera'));

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'homeassistant/camera/room-assistant/test-instance-test-camera/config',
      expect.any(String),
      {
        qos: 0,
        retain: true,
      }
    );
    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/camera/test-instance-test-camera/status',
      'online',
      {
        qos: 0,
        retain: true,
      }
    );
    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unique_id: 'room-assistant-test-instance-test-camera',
      name: 'Test Camera',
      topic: 'room-assistant/camera/test-instance-test-camera/state',
      json_attributes_topic:
        'room-assistant/camera/test-instance-test-camera/attributes',
      availability_topic:
        'room-assistant/camera/test-instance-test-camera/status',
    });
  });

  it('should include device information in the discovery message', async () => {
    mockSystem.mockResolvedValue({
      serial: 'abcd',
      model: 'Raspberry Pi',
      manufacturer: 'Foundation',
    } as SystemData);

    await service.onModuleInit();
    service.handleNewEntity(new Sensor('d6t-sensor', 'D6T Sensor'));

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      device: {
        identifiers: 'abcd',
        name: 'test-instance',
        model: 'Raspberry Pi',
        manufacturer: 'Foundation',
      },
    });
  });

  it('should make the instance name the device identifier if no serial was found', async () => {
    mockSystem.mockResolvedValue({
      serial: '-',
      model: 'Docker Container',
      manufacturer: '',
    } as SystemData);

    await service.onModuleInit();
    service.handleNewEntity(new Sensor('grideye-sensor', 'GridEYE Sensor'));

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      device: {
        identifiers: 'test-instance',
        name: 'test-instance',
        model: 'Docker Container',
        manufacturer: '',
      },
    });
  });

  it('should apply sensor customizations to the discovery message', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('custom-sensor', 'Custom'), [
      {
        for: SensorConfig,
        overrides: {
          unitOfMeasurement: 'm',
          icon: 'mdi:distance',
        },
      },
    ]);

    expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject({
      unit_of_measurement: 'm',
      icon: 'mdi:distance',
    });
  });

  it('should exclude internal values from the discovery message', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));

    const configMsg = JSON.parse(mockMqttClient.publish.mock.calls[0][1]);
    expect(configMsg).not.toMatchObject({
      component: 'sensor',
    });
    expect(configMsg).not.toMatchObject({
      config_topic:
        'homeassistant/sensor/room-assistant/test-instance-test-sensor/config',
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
    await service.onModuleInit();
    service.handleNewEntity(new Sensor('test', 'Test'));
    service.handleNewState('test', 2);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/sensor/test-instance-test/state',
      '2',
      {
        qos: 0,
        retain: true,
      }
    );
  });

  it('should publish Buffer states in binary form', async () => {
    const imageData = new Buffer('abc');

    await service.onModuleInit();
    service.handleNewEntity(new Camera('test', 'Test'));
    service.handleNewState('test', imageData);

    expect(mockMqttClient.publish).toHaveBeenCalledWith(
      'room-assistant/camera/test-instance-test/state',
      imageData,
      {
        qos: 0,
        retain: true,
      }
    );
  });

  it('should ignore state updates if the entity is not registered with Home Assistant', () => {
    service.handleNewState('does-not-exist', 'not_home');
    expect(mockMqttClient.publish).not.toHaveBeenCalled();
  });

  it('should publish attribute updates for entities', async () => {
    jest.useFakeTimers();
    await service.onModuleInit();
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
    await service.onModuleInit();
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

  it('should match incoming messages to the correct entity', async () => {
    await service.onModuleInit();
    const mockSwitch = new Switch('test-switch', 'Test Switch');
    const turnOnSpy = jest.spyOn(mockSwitch, 'turnOn');
    service.handleNewEntity(mockSwitch);
    service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));
    service.handleNewEntity(new Switch('switch2', 'Second Switch'));

    service.handleIncomingMessage(
      'room-assistant/switch/test-instance-test-switch/command',
      Buffer.from('on')
    );
    expect(turnOnSpy).toHaveBeenCalled();
  });

  it('should ignore incoming messages for unknown entities', async () => {
    await service.onModuleInit();
    service.handleNewEntity(new Switch('test-switch', 'Test Switch'));

    expect(() => {
      service.handleIncomingMessage(
        'room-assistant/switch/123-test/command',
        Buffer.from('on')
      );
    }).not.toThrowError();
  });

  it('should ignore incoming messages with invalid commands', async () => {
    await service.onModuleInit();
    const mockSwitch = new Switch('test-switch', 'Test Switch');
    service.handleNewEntity(mockSwitch);
    const turnOnSpy = jest.spyOn(mockSwitch, 'turnOn');
    const turnOffSpy = jest.spyOn(mockSwitch, 'turnOff');

    expect(() => {
      service.handleIncomingMessage(
        'room-assistant/switch/test-instance-test-switch/command',
        Buffer.from('invalid')
      );
    }).not.toThrowError();
    expect(turnOnSpy).not.toHaveBeenCalled();
    expect(turnOffSpy).not.toHaveBeenCalled();
  });
});
