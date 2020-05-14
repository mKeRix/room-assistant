const mockNoble = {
  on: jest.fn(),
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
    add: jest.fn(),
  };
  const mockConfig: Partial<XiaomiMiConfig> = {
    sensors: [],
  };
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'xiaomiMi' ? mockConfig : c.get(key);
    }),
  };
  const loggerService = {
    log: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  function advert(address: string, serviceData: string): Peripheral {
    return {
      id: address,
      advertisement: {
        serviceData: [{ uuid: 'fe95', data: Buffer.from(serviceData, 'hex') }],
      },
    } as Peripheral;
  }

  // Some of this test data was ported from
  // https://github.com/hannseman/homebridge-mi-hygrothermograph/blob/master/test/parser.test.js
  const testAddress = '4c65a8d0ae64';
  const serviceData = {
    temperature: '70205b044c64aed0a8654c09041002cc00',
    humidity: '70205b044964aed0a8654c09061002ea01',
    temperatureAndHumidity: '5020aa01b064aed0a8654c0d1004d9006001',
    negativeTemperature: '5020aa01a664aed0a8654c04100285ff',
    battery: '5020aa014e64aed0a8654c0a10015d',
    moisture: '71209800a864aed0a8654c0d08100112',
    moistureNoMac: '60209800a80d08100112',
    illuminance: '71209800a764aed0a8654c0d0710030e0000',
    fertility: '71209800a564aed0a8654c0d091002b800',
    encrypted: '58585b05db184bf838c1a472c3fa42cd050000ce7b8a28',
  };
  const bindKey = 'b2d46f0cd168c18b247c0c79e9ad5b8d';

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfig.sensors = [{ name: 'test', address: testAddress }];

    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule],
      providers: [XiaomiMiService],
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
    service.onModuleInit();
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
    expect(loggerService.warn).not.toHaveBeenCalled();

    mockConfig.sensors = [];
    service.onModuleInit();
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should not publish from unknown devices', () => {
    mockConfig.sensors = [{ name: 'test', address: 'cba987654321' }];
    service.onModuleInit();
    service.handleDiscovery(advert(testAddress, serviceData.temperature));
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should warn if device not Xiaomi', () => {
    service.handleDiscovery({
      id: testAddress,
      advertisement: {
        serviceData: [
          {
            uuid: 'bad',
            data: Buffer.from(serviceData.temperature, 'hex'),
          },
        ],
      },
    } as Peripheral);
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should publish temperature', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.temperature));

    expect(sensor.state).toBe(20.4);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'temperature',
        unitOfMeasurement: '°C',
      },
    });
  });

  it('should publish humidity', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.humidity));

    expect(sensor.state).toBe(49);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'humidity',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish temperature and humidity', () => {
    const temp = new Sensor('temp', 'temp');
    const humidity = new Sensor('humidity', 'humidity');
    entitiesService.add.mockReturnValueOnce(temp).mockReturnValueOnce(humidity);

    service.handleDiscovery(
      advert(testAddress, serviceData.temperatureAndHumidity)
    );

    expect(temp.state).toBe(21.7);
    expect(humidity.state).toBe(35.2);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'temperature',
        unitOfMeasurement: '°C',
      },
    });

    expect(entitiesService.add.mock.calls[1][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'humidity',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish battery', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.battery));

    expect(sensor.state).toBe(93);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'battery',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish moisture', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.moisture));

    expect(sensor.state).toBe(18);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'moisture',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish even if missing mac address', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.moistureNoMac));

    expect(sensor.state).toBe(18);
  });

  it('should publish illuminance', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.illuminance));

    expect(sensor.state).toBe(14);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'illuminance',
        unitOfMeasurement: 'lx',
      },
    });
  });

  it('should publish fertility', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.fertility));

    expect(sensor.state).toBe(184);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'fertility',
        unitOfMeasurement: '',
      },
    });
  });

  it('should reuse existing entities', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.get.mockReturnValueOnce(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.humidity));

    expect(sensor.state).toBe(49);
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should ignore advertisements with no event', () => {
    service.handleDiscovery(advert(testAddress, '30585b05a064aed0a8654c08'));

    expect(entitiesService.add).not.toHaveBeenCalled();
    expect(entitiesService.get).not.toHaveBeenCalled();
  });

  it('should decrypt advertisements', () => {
    mockConfig.sensors = [
      {
        name: 'test',
        address: testAddress,
        bindKey: bindKey,
      },
    ];
    service.onModuleInit();
    const sensor = new Sensor('testid', 'Test');
    entitiesService.get.mockReturnValueOnce(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.encrypted));

    expect(sensor.state).toBe(43.9);
  });

  it('should warn on missing bindKey for encrypted payloads', () => {
    service.handleDiscovery(advert(testAddress, serviceData.encrypted));

    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalled();
  });

  it('should report an error on short advertisements', () => {
    service.handleDiscovery(advert(testAddress, '5020'));
    expect(loggerService.error).toHaveBeenCalled();
  });

  it('should warn on empty buffers', () => {
    service.handleDiscovery({
      id: testAddress,
      advertisement: {
        serviceData: [{ uuid: 'fe95', data: null }],
      },
    } as Peripheral);
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should report an error on invalid event types', () => {
    service.handleDiscovery(
      advert(testAddress, '5020aa014e64aed0a8654c0a11015d')
    );
    expect(loggerService.error).toHaveBeenCalled();
  });

  it('should publish negative temperatures', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.add.mockReturnValue(sensor);
    service.handleDiscovery(
      advert(testAddress, serviceData.negativeTemperature)
    );
    expect(sensor.state).toBe(-12.3);
  });
});
