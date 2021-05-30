const mockMqttClient = {
  on: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  end: jest.fn(),
};

import { ClusterModule } from '../../cluster/cluster.module';
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
import { EntitiesModule } from '../../entities/entities.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { HomeAssistantConfig } from './home-assistant.config';
import { ConfigService } from '../../config/config.service';
import c from 'config';

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

class MockClusterService extends EventEmitter {
  leader = jest.fn().mockReturnValue({ id: 'test-instance' });
  isLeader = jest.fn().mockReturnValue(true);
}

describe('HomeAssistantService', () => {
  let service: HomeAssistantService;
  let mockConfig: HomeAssistantConfig;
  const mockMqtt = mocked(mqtt, true);
  const mockSystem = mocked(system);
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };
  const entitiesService = {
    getAll: jest.fn().mockReturnValue([]),
    hasAuthorityOver: jest.fn().mockReturnValue(true),
  };
  const entitiesEmitter = new EventEmitter();
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'homeAssistant' ? mockConfig : c.get(key);
    }),
  };
  const clusterService = new MockClusterService();

  beforeEach(async () => {
    mockConfig = new HomeAssistantConfig();
    entitiesEmitter.removeAllListeners();
    clusterService.removeAllListeners();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestEmitterModule.forRoot(entitiesEmitter),
        ConfigModule,
        EntitiesModule,
        ClusterModule,
      ],
      providers: [HomeAssistantService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();
    module.useLogger(loggerService);

    jest.clearAllMocks();
    mockMqttClient.on.mockReset();

    service = module.get<HomeAssistantService>(HomeAssistantService);
  });

  describe('Service Lifecycle', () => {
    it('should subscribe to entity events on init', async () => {
      const emitterOnSpy = jest.spyOn(entitiesEmitter, 'on');

      await service.onModuleInit();
      expect(emitterOnSpy).toHaveBeenCalledWith(
        'newEntity',
        expect.any(Function)
      );
      expect(emitterOnSpy).toHaveBeenCalledWith(
        'entityUpdate',
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

    it('should terminate the MQTT connection gracefully on shutdown', async () => {
      await service.onModuleInit();
      await service.onApplicationShutdown();

      expect(mockMqttClient.end).toHaveBeenCalled();
    });
  });

  describe('New Entities', () => {
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
      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-test-instance-test-sensor',
          name: 'Test Sensor',
          state_topic: 'room-assistant/sensor/test-instance-test-sensor/state',
          json_attributes_topic:
            'room-assistant/sensor/test-instance-test-sensor/attributes',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/sensor/test-instance-test-sensor/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
        }
      );
    });

    it('should publish discovery configuration for a new distributed sensor', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('dist-sensor', 'Dist Sensor', true));

      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-dist-sensor',
          name: 'Dist Sensor',
          state_topic: 'room-assistant/sensor/dist-sensor/state',
          json_attributes_topic: 'room-assistant/sensor/dist-sensor/attributes',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/sensor/dist-sensor/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
          device: {
            identifiers: 'room-assistant-distributed',
            name: 'room-assistant hub',
          },
        }
      );
    });

    it('should publish discovery configuration for a new distributed, state-unlocked sensor', async () => {
      await service.onModuleInit();
      service.handleNewEntity(
        new Sensor('dist-sensor', 'Dist Sensor', true, false)
      );

      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-dist-sensor',
          state_topic: 'room-assistant/sensor/dist-sensor/state',
          json_attributes_topic: 'room-assistant/sensor/dist-sensor/attributes',
          availability: [],
          device: {
            identifiers: 'room-assistant-distributed',
            name: 'room-assistant hub',
          },
        }
      );
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
      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-test-instance-bin-sensor',
          name: 'Binary',
          state_topic:
            'room-assistant/binary_sensor/test-instance-bin-sensor/state',
          json_attributes_topic:
            'room-assistant/binary_sensor/test-instance-bin-sensor/attributes',
          payload_on: 'true',
          payload_off: 'false',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic:
                'room-assistant/binary_sensor/test-instance-bin-sensor/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
        }
      );
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
      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-test-instance-test-switch',
          name: 'Test Switch',
          state_topic: 'room-assistant/switch/test-instance-test-switch/state',
          command_topic:
            'room-assistant/switch/test-instance-test-switch/command',
          json_attributes_topic:
            'room-assistant/switch/test-instance-test-switch/attributes',
          payload_on: 'on',
          payload_off: 'off',
          state_on: 'true',
          state_off: 'false',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/switch/test-instance-test-switch/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
        }
      );
    });

    it('should subscribe to the command topic when registering a new switch', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Switch('test-switch', 'Test Switch'));

      expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
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
      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-test-tracker',
          name: 'Test Tracker',
          state_topic: 'room-assistant/device_tracker/test-tracker/state',
          json_attributes_topic:
            'room-assistant/device_tracker/test-tracker/attributes',
          payload_home: 'home',
          payload_not_home: 'not_home',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/device_tracker/test-tracker/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
        }
      );
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
      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unique_id: 'room-assistant-test-instance-test-camera',
          name: 'Test Camera',
          topic: 'room-assistant/camera/test-instance-test-camera/state',
          json_attributes_topic:
            'room-assistant/camera/test-instance-test-camera/attributes',
          availability_mode: 'all',
          availability: [
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/camera/test-instance-test-camera/status',
            },
            {
              payload_available: 'online',
              payload_not_available: 'offline',
              topic: 'room-assistant/status/test-instance',
            },
          ],
        }
      );
    });

    it('should include device information in the discovery message', async () => {
      mockSystem.mockResolvedValue({
        serial: 'abcd',
        model: 'Raspberry Pi',
        manufacturer: 'Foundation',
      } as SystemData);

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('d6t-sensor', 'D6T Sensor'));

      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          device: {
            identifiers: 'abcd',
            name: 'test-instance',
            model: 'Raspberry Pi',
            manufacturer: 'Foundation',
          },
        }
      );
    });

    it('should make the instance name the device identifier if no serial was found', async () => {
      mockSystem.mockResolvedValue({
        serial: '-',
        model: 'Docker Container',
        manufacturer: '',
      } as SystemData);

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('grideye-sensor', 'GridEYE Sensor'));

      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          device: {
            identifiers: 'test-instance',
            name: 'test-instance',
            model: 'Docker Container',
            manufacturer: '',
          },
        }
      );
    });

    it('should format device connections correctly', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test'), [
        {
          for: SensorConfig,
          overrides: {
            device: {
              connections: [['mac', '12:34']],
            },
          },
        },
      ]);

      expect(
        JSON.parse(mockMqttClient.publish.mock.calls[1][1]).device
      ).toEqual({
        connections: [['mac', '12:34']],
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

      expect(JSON.parse(mockMqttClient.publish.mock.calls[1][1])).toMatchObject(
        {
          unit_of_measurement: 'm',
          icon: 'mdi:distance',
        }
      );
    });

    it('should exclude internal values from the discovery message', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test-sensor', 'Test Sensor'));

      const configMsg = JSON.parse(mockMqttClient.publish.mock.calls[1][1]);
      const configKeys = Object.keys(configMsg);
      expect(configKeys).not.toContain('component');
      expect(configKeys).not.toContain('config_topic');
      expect(configKeys).not.toContain('distributed');
      expect(configKeys).not.toContain('stateLocked');
      expect(configKeys).not.toContain('_instanceStatusTopic');
      expect(configKeys).not.toContain('_entityStatusTopic');
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
  });

  describe('Availability', () => {
    it('should send an instance online status on startup', async () => {
      await service.onModuleInit();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/status/test-instance',
        'online',
        {
          qos: 1,
        }
      );
    });

    it('should configure a last will message', async () => {
      await service.onModuleInit();

      expect(mockMqtt.connectAsync).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          will: {
            topic: 'room-assistant/status/test-instance',
            payload: 'offline',
            retain: false,
            qos: 1,
            properties: {
              willDelayInterval: 60,
            },
          },
        }),
        expect.anything()
      );
    });

    it.each([
      ['sensor', new Sensor('test', 'Test')],
      ['binary_sensor', new BinarySensor('test', 'Test')],
      ['device_tracker', new DeviceTracker('test', 'Test')],
      ['switch', new Switch('test', 'Test')],
      ['camera', new Camera('test', 'Test')],
    ])(
      'should send an entity status when a %s is added',
      async (component: string, entity: Entity) => {
        await service.onModuleInit();
        service.handleNewEntity(entity);

        expect(mockMqttClient.publish).toHaveBeenCalledWith(
          `room-assistant/${component}/test-instance-${entity.id}/status`,
          'online'
        );
      }
    );

    it('should clear old retained status messages from pre-2.18.x', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test'));

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/status',
        '',
        {
          retain: true,
        }
      );
    });

    it('should send an instance status message as heartbeat', async () => {
      await service.onModuleInit();
      mockMqttClient.publish.mockClear();

      service.sendHeartbeats();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/status/test-instance',
        'online',
        {
          qos: 1,
        }
      );
    });

    it('should send entity status messages as heartbeat', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test1', 'Test 1'));
      service.handleNewEntity(new Sensor('test2', 'Test 2'));
      mockMqttClient.publish.mockClear();

      service.sendHeartbeats();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test1/status',
        'online'
      );
      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test2/status',
        'online'
      );
    });

    it('should not send heartbeat entity status message for state unlocked entity', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test1', 'Test 1', true, false));
      mockMqttClient.publish.mockClear();

      service.sendHeartbeats();

      expect(mockMqttClient.publish).toHaveBeenCalledTimes(1); // only instance heartbeat
    });

    it('should send heartbeats on broker reconnect', async () => {
      const mqttEmitter = new EventEmitter();
      mockMqttClient.on.mockImplementation((event, callback) => {
        mqttEmitter.on(event, callback);
      });
      await service.onModuleInit();
      mockMqttClient.publish.mockClear();

      mqttEmitter.emit('connect');

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/status/test-instance',
        'online',
        {
          qos: 1,
        }
      );
    });

    it('should update availability topics of distributed entities if instance is elected as new leader', async () => {
      clusterService.leader.mockReturnValue({ id: 'old-leader' });

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test', true));
      mockMqttClient.publish.mockClear();

      clusterService.leader.mockReturnValue({ id: 'new-leader' });
      clusterService.isLeader.mockReturnValue(true);

      clusterService.emit('elected', { id: 'new-leader' });

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'homeassistant/sensor/room-assistant/test/config',
        expect.any(String),
        { qos: 0, retain: true }
      );
      expect(JSON.parse(mockMqttClient.publish.mock.calls[0][1])).toMatchObject(
        {
          availability: expect.arrayContaining([
            expect.objectContaining({
              topic: 'room-assistant/sensor/test/status',
            }),
            expect.objectContaining({
              topic: 'room-assistant/status/new-leader',
            }),
          ]),
        }
      );
    });

    it('should not update availability topics of local entities if instance is elected as new leader', async () => {
      clusterService.leader.mockReturnValue({ id: 'old-leader' });

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test'));
      mockMqttClient.publish.mockClear();

      clusterService.leader.mockReturnValue({ id: 'new-leader' });
      clusterService.isLeader.mockReturnValue(true);

      clusterService.emit('elected', { id: 'new-leader' });

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });

    it('should not update availability topics of distributed state-unlocked entities if instance is elected as new leader', async () => {
      clusterService.leader.mockReturnValue({ id: 'old-leader' });

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test', true, false));
      mockMqttClient.publish.mockClear();

      clusterService.leader.mockReturnValue({ id: 'new-leader' });
      clusterService.isLeader.mockReturnValue(true);

      clusterService.emit('elected', { id: 'new-leader' });

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });

    it('should send an instance offline status on shutdown', async () => {
      await service.onModuleInit();
      mockMqttClient.publish.mockClear();

      await service.onApplicationShutdown();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/status/test-instance',
        'offline',
        {
          qos: 1,
        }
      );
    });

    it('should send offline messages for local entities on shutdown', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test', 'Test'));
      service.handleNewEntity(new Sensor('test2', 'Test 2'));
      mockMqttClient.publish.mockClear();

      await service.onApplicationShutdown();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/status',
        'offline'
      );
      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test2/status',
        'offline'
      );
    });

    it('should send offline messages for distributed entities if the leader', async () => {
      clusterService.isLeader.mockReturnValue(true);

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test-sensor', 'Dist', true));
      mockMqttClient.publish.mockClear();

      await service.onApplicationShutdown();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-sensor/status',
        'offline'
      );
    });

    it('should not send offline messages for distributed entities if not the leader', async () => {
      clusterService.isLeader.mockReturnValue(false);

      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test-sensor', 'Dist', true));
      mockMqttClient.publish.mockClear();

      await service.onApplicationShutdown();

      expect(mockMqttClient.publish).not.toHaveBeenCalledWith(
        'room-assistant/sensor/test-sensor/status',
        'offline'
      );
    });

    it('should not send offline messages for distributed entities with an unlocked state', async () => {
      await service.onModuleInit();
      service.handleNewEntity(new Sensor('test-sensor', 'Dist', true, false));
      mockMqttClient.publish.mockClear();

      await service.onApplicationShutdown();

      expect(mockMqttClient.publish).not.toHaveBeenCalledWith(
        'room-assistant/sensor/test-sensor/status',
        'offline'
      );
    });
  });

  describe('State Updates', () => {
    it('should publish state updates for entities', async () => {
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      sensor.state = 2;
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: 2,
            oldValue: undefined,
            path: '/state',
          },
        ],
        true
      );

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
      const imageData = Buffer.from('abc');

      await service.onModuleInit();
      const camera = new Camera('test', 'Test');
      service.handleNewEntity(camera);

      camera.state = imageData;
      service.handleEntityUpdate(
        camera,
        [
          {
            newValue: imageData,
            oldValue: undefined,
            path: '/state',
          },
        ],
        true
      );

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
      service.handleEntityUpdate(
        new Sensor('does-not-exist', 'Ghost'),
        [
          {
            newValue: 42,
            oldValue: undefined,
            path: '/state',
          },
        ],
        true
      );

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });

    it('should ignore entity updates that do not change state or attributes', async () => {
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);
      mockMqttClient.publish.mockClear();

      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: 2,
            oldValue: undefined,
            path: '/something-unrelated/abc/def',
          },
        ],
        true
      );

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe('Attribute Updates', () => {
    it('should publish attribute updates for entities', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      sensor.attributes.stateUpdated = true;
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: true,
            oldValue: undefined,
            path: '/attributes/stateUpdated',
          },
        ],
        true
      );
      jest.runAllTimers();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/attributes',
        JSON.stringify({ state_updated: true })
      );
    });

    it('should debounce the attribute updates', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);
      mockMqttClient.publish.mockClear();

      sensor.attributes.stateUpdated = true;
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: true,
            oldValue: undefined,
            path: '/attributes/stateUpdated',
          },
        ],
        true
      );

      sensor.attributes.test = 1234;
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: 1234,
            oldValue: undefined,
            path: '/attributes/test',
          },
        ],
        true
      );

      jest.runAllTimers();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/attributes',
        JSON.stringify({ state_updated: true, test: 1234 })
      );
      expect(mockMqttClient.publish).toHaveBeenCalledTimes(1);
    });

    it('should format string array attribute updates correctly', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      sensor.attributes.nodes = ['abc', 'def'];
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: ['abc', 'def'],
            oldValue: undefined,
            path: '/attributes/nodes',
          },
        ],
        true
      );
      jest.runAllTimers();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/attributes',
        JSON.stringify({ nodes: ['abc', 'def'] })
      );
    });

    it('should not publish attribute updates if sendAttributes is disabled', async () => {
      jest.useFakeTimers();
      mockConfig.sendAttributes = false;

      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      sensor.attributes.stateUpdated = true;
      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: true,
            oldValue: undefined,
            path: '/attributes/stateUpdated',
          },
        ],
        true
      );
      jest.runAllTimers();

      expect(mockMqttClient.publish).not.toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/attributes',
        expect.anything()
      );
    });

    it('should ignore attribute updates if the entity is not registered with Home Assistant', () => {
      jest.useFakeTimers();
      service.handleEntityUpdate(
        new Sensor('does-not-exist', 'Ghost'),
        [
          {
            newValue: 42,
            oldValue: undefined,
            path: '/attributes/test',
          },
        ],
        true
      );
      jest.runAllTimers();

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe('MQTT Room Presence', () => {
    it('should publish mqtt room updates for entities with distances', async () => {
      mockConfig.sendMqttRoom = true;

      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: { distance: 4.2 },
            oldValue: undefined,
            path: '/distances/living-room',
          },
          {
            newValue: { distance: 13.37 },
            oldValue: undefined,
            path: '/distances/bedroom',
          },
          {
            newValue: 'living-room',
            oldValue: undefined,
            path: '/state',
          },
        ],
        true
      );

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/mqtt-room/living-room',
        '{"id":"test","name":"Test","distance":4.2}'
      );
      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/mqtt-room/bedroom',
        '{"id":"test","name":"Test","distance":13.37}'
      );
    });

    it('should publish mqtt room updates with configured topic prefix', async () => {
      mockConfig.sendMqttRoom = true;
      mockConfig.mqttRoomPrefix = 'custom/prefix';

      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);

      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: { distance: 4.2 },
            oldValue: undefined,
            path: '/distances/living-room',
          },
        ],
        true
      );

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'custom/prefix/living-room',
        expect.any(String)
      );
    });

    it('should not publish mqtt room updates if the feature is disabled', async () => {
      mockConfig.sendMqttRoom = false;

      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      service.handleNewEntity(sensor);
      mockMqttClient.publish.mockClear();

      service.handleEntityUpdate(
        sensor,
        [
          {
            newValue: { distance: 4.2 },
            oldValue: undefined,
            path: '/distances/living-room',
          },
        ],
        true
      );

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe('Entity Refreshing', () => {
    it('should refresh entities on broker reconnect', async () => {
      const spy = jest.spyOn(service, 'refreshEntities');

      const mqttEmitter = new EventEmitter();
      mockMqttClient.on.mockImplementation((event, callback) => {
        mqttEmitter.on(event, callback);
      });
      await service.onModuleInit();

      mqttEmitter.emit('connect');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should refresh entities after a new leader was elected', async () => {
      const spy = jest.spyOn(service, 'refreshEntities');

      await service.onModuleInit();
      clusterService.emit('elected');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should send state and attribute messages on refresh for entities that we have authority over', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      entitiesService.getAll.mockReturnValue([sensor]);
      service.handleNewEntity(sensor);

      sensor.state = 2;
      sensor.attributes.test = 123;

      service.refreshEntities();
      jest.runAllTimers();

      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/state',
        '2',
        {
          qos: 0,
          retain: true,
        }
      );
      expect(mockMqttClient.publish).toHaveBeenCalledWith(
        'room-assistant/sensor/test-instance-test/attributes',
        JSON.stringify({ test: 123 })
      );
    });

    it('should send no messages on refresh for entities that we have no authority over', async () => {
      jest.useFakeTimers();
      await service.onModuleInit();
      const sensor = new Sensor('test', 'Test');
      entitiesService.getAll.mockReturnValue([sensor]);
      entitiesService.hasAuthorityOver.mockReturnValue(false);
      service.handleNewEntity(sensor);
      mockMqttClient.publish.mockClear();

      service.refreshEntities();
      jest.runAllTimers();

      expect(mockMqttClient.publish).not.toHaveBeenCalled();
    });
  });

  describe('Switch Commands', () => {
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
});
