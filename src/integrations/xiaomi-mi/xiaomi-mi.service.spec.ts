const mockNoble = {
  on: jest.fn()
};
jest.mock(
  '@abandonware/noble',
  () => {
    return mockNoble;
  },
  { virtual: true }
);

import { Peripheral } from '@abandonware/noble';
import { ConfigService } from '../../config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { XiaomiMiService } from './xiaomi-mi.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ClusterService } from '../../cluster/cluster.service';
import { EntitiesService } from '../../entities/entities.service';
import { XiaomiMiConfig } from './xiaomi-mi.config';
import { Sensor } from '../../entities/sensor';
import { SensorConfig } from '../home-assistant/sensor-config';
import c from 'config';

describe('XiaomiMiService', () => {
  let service: XiaomiMiService;
  const entitiesService = {
    get: jest.fn(),
    add: jest.fn()
  };
  let mockConfig: Partial<XiaomiMiConfig> = {
    sensors: []
  };
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'xiaomiMi' ? mockConfig : c.get(key);
    })
  };
  const loggerService = {
    log: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfig = { sensors: [] };

    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule],
      providers: [XiaomiMiService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(ClusterService)
      .useValue({})
      .compile();
    module.useLogger(loggerService);

    service = module.get<XiaomiMiService>(XiaomiMiService);
  });

  it('should setup noble listeners on bootstrap', () => {
    service.onApplicationBootstrap();
    expect(mockNoble.on).toHaveBeenCalledWith(
      'stateChange',
      expect.any(Function)
    );
    expect(mockNoble.on).toHaveBeenCalledWith('discover', expect.any(Function));
    expect(mockNoble.on).toHaveBeenCalledWith('warning', expect.any(Function));
  });

  it('should warn if no sensors have been configured', () => {
    mockConfig.sensors = [{ name: 'test', address: 'test' }];
    service.onModuleInit();
    expect(loggerService.warn).not.toHaveBeenCalled();

    mockConfig.sensors = [];
    service.onModuleInit();
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should not publish from unknown devices', () => {
    mockConfig.sensors = [{ name: 'test', address: 'cba987654321' }];
    service.onModuleInit();
    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from('70205b044cbc9a7856341209041002cc00', 'hex')
          }
        ]
      }
    } as Peripheral);
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should warn if device not Xiaomi', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();
    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'bad',
            data: Buffer.from('70205b044cbc9a7856341209041002cc00', 'hex')
          }
        ]
      }
    } as Peripheral);
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should publish temperature', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from('70205b044cbc9a7856341209041002cc00', 'hex')
          }
        ]
      }
    } as Peripheral);

    expect(sensor.state).toBe(20.4);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'temperature',
        unitOfMeasurement: '°C'
      }
    });
  });

  it('should publish humidity', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from('70205b0449bc9a7856341209061002ea01', 'hex')
          }
        ]
      }
    } as Peripheral);

    expect(sensor.state).toBe(49);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'humidity',
        unitOfMeasurement: '%'
      }
    });
  });

  it('should reuse existing entities', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();
    const sensor = new Sensor('testid', 'Test');
    entitiesService.get.mockReturnValue(sensor);

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from('70205b0449bc9a7856341209061002ea01', 'hex')
          }
        ]
      }
    } as Peripheral);

    expect(sensor.state).toBe(49);
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should ignore advertisements with no event', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from('30585b05a0bc9a7856341208', 'hex')
          }
        ]
      }
    } as Peripheral);

    expect(entitiesService.add).not.toHaveBeenCalled();
    expect(entitiesService.get).not.toHaveBeenCalled();
  });

  it('should decrypt advertisements', () => {
    mockConfig.sensors = [
      {
        name: 'test',
        address: '123456789abc',
        bindKey: 'b0d0cf12b0150054551e4ab8376d43b1'
      }
    ];
    service.onModuleInit();
    const sensor = new Sensor('testid', 'Test');
    entitiesService.get.mockReturnValue(sensor);

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from(
              '58585b0521de429138c1a4a2f89957260200001cfa0b56',
              'hex'
            )
          }
        ]
      }
    } as Peripheral);

    expect(sensor.state).toBe(20.8);
  });

  it('should warn on missing bindKey for encrypted payloads', () => {
    mockConfig.sensors = [{ name: 'test', address: '123456789abc' }];
    service.onModuleInit();

    service.handleDiscovery({
      id: '123456789abc',
      advertisement: {
        serviceData: [
          {
            uuid: 'fe95',
            data: Buffer.from(
              '58585b0521bc9a78563412a2f89957260200001cfa0b56',
              'hex'
            )
          }
        ]
      }
    } as Peripheral);

    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalled();
  });
});
