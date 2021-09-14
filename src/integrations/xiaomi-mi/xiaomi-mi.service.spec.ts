import { Peripheral } from '@mkerix/noble';
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
import { BluetoothService } from '../../integration-support/bluetooth/bluetooth.service';
import { BluetoothModule } from '../../integration-support/bluetooth/bluetooth.module';
import { Parser } from './parser';

describe('XiaomiMiService', () => {
  let service: XiaomiMiService;
  const bluetoothService = {
    onLowEnergyDiscovery: jest.fn(),
    queryLowEnergyDevice: jest.fn(),
  };
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
    mifloraFert1: '712098000164aed0a8654c0d091002b800',
    mifloraFert2: '712098000264aed0a8654c0d091002b800',
  };
  const bindKey = 'b2d46f0cd168c18b247c0c79e9ad5b8d';
  const deviceInfo = {
    identifiers: '4c65a8d0ae64',
    manufacturer: 'Xiaomi',
    name: 'test',
    viaDevice: 'room-assistant-distributed',
  };
  const FRAME_COUNTER_INDEX = 4;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfig.sensors = [{ name: 'test', address: testAddress }];

    const module: TestingModule = await Test.createTestingModule({
      imports: [BluetoothModule, EntitiesModule, ConfigModule],
      providers: [XiaomiMiService],
    })
      .overrideProvider(BluetoothService)
      .useValue(bluetoothService)
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

  it('should setup BLE listener on bootstrap', () => {
    service.onApplicationBootstrap();
    expect(bluetoothService.onLowEnergyDiscovery).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should warn if no sensors have been configured', () => {
    expect(loggerService.warn).not.toHaveBeenCalled();

    mockConfig.sensors = [];
    service.onModuleInit();
    expect(loggerService.warn).toHaveBeenCalledTimes(1);
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('No sensors entries in the config'),
      'XiaomiMiService'
    );
  });

  it('should not publish from unknown devices', () => {
    mockConfig.sensors = [{ name: 'test', address: 'cba987654321' }];
    service.onModuleInit();
    service.handleDiscovery(advert(testAddress, serviceData.temperature));
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should warn if message parser is incorrectly initialised', () => {
    expect(() => {
      new Parser(null);
    }).toThrow('A buffer must be provided.');
  });

  it('should not publish if missing service data in advertisement', () => {
    service.handleDiscovery({
      id: testAddress,
      advertisement: {},
    } as Peripheral);
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should not publish if service data in advertisement is not Xiaomi', () => {
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
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should publish temperature', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.temperature));

    deviceInfo['model'] = 'Mijia LYWSD02';

    expect(sensor.state).toBe(20.4);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'temperature',
        stateClass: 'measurement',
        unitOfMeasurement: '°C',
      },
    });
  });

  it('should publish humidity', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.humidity));

    deviceInfo['model'] = 'Mijia LYWSD02';

    expect(sensor.state).toBe(49);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'humidity',
        stateClass: 'measurement',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish temperature and humidity', () => {
    const temp = new Sensor('temp', 'temp', true, false);
    const humidity = new Sensor('humidity', 'humidity', true, false);
    entitiesService.add.mockReturnValueOnce(temp).mockReturnValueOnce(humidity);

    service.handleDiscovery(
      advert(testAddress, serviceData.temperatureAndHumidity)
    );

    deviceInfo['model'] = 'Miija LYWSDCGQ';

    expect(temp.state).toBe(21.7);
    expect(humidity.state).toBe(35.2);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'temperature',
        stateClass: 'measurement',
        unitOfMeasurement: '°C',
      },
    });

    deviceInfo['model'] = 'Miija LYWSDCGQ';

    expect(entitiesService.add.mock.calls[1][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'humidity',
        stateClass: 'measurement',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish battery', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.battery));

    deviceInfo['model'] = 'Miija LYWSDCGQ';

    expect(sensor.state).toBe(93);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'battery',
        stateClass: 'measurement',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish moisture', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.moisture));

    deviceInfo['model'] = 'Mi Flora HHCCJCY01';

    expect(sensor.state).toBe(18);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: undefined,
        stateClass: 'measurement',
        unitOfMeasurement: '%',
      },
    });
  });

  it('should publish even if missing mac address', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.moistureNoMac));

    expect(sensor.state).toBe(18);
  });

  it('should publish illuminance', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.illuminance));

    deviceInfo['model'] = 'Mi Flora HHCCJCY01';

    expect(sensor.state).toBe(14);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: 'illuminance',
        stateClass: 'measurement',
        unitOfMeasurement: 'lx',
      },
    });
  });

  it('should publish fertility', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.fertility));

    deviceInfo['model'] = 'Mi Flora HHCCJCY01';

    expect(sensor.state).toBe(184);
    expect(entitiesService.add.mock.calls[0][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        device: deviceInfo,
        deviceClass: undefined,
        stateClass: 'measurement',
        unitOfMeasurement: 'µS/cm',
      },
    });
  });

  it('should reuse existing entities', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.get.mockReturnValueOnce(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.humidity));

    expect(sensor.state).toBe(49);
    expect(entitiesService.add).not.toHaveBeenCalled();
  });

  it('should not publish when advertisements with no event', () => {
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
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.get.mockReturnValueOnce(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.encrypted));

    expect(sensor.state).toBe(43.9);
  });

  it('should not publish on missing bindKey for encrypted payloads', () => {
    service.handleDiscovery(advert(testAddress, serviceData.encrypted));

    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalledTimes(1);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('Please configure a bindKey'),
      'XiaomiMiService'
    );
  });

  it('should not publish on short advertisements', () => {
    service.handleDiscovery(advert(testAddress, '5020'));
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalledTimes(1);
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('Service data length must be >= 5 bytes'),
      'XiaomiMiService'
    );
  });

  it('should not publish on empty buffers', () => {
    service.handleDiscovery({
      id: testAddress,
      advertisement: {
        serviceData: [{ uuid: 'fe95', data: null }],
      },
    } as Peripheral);
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.debug).toHaveBeenCalled();
    expect(loggerService.debug).toHaveBeenCalledWith(
      expect.stringContaining('supported data format not present'),
      'XiaomiMiService'
    );
  });

  it('should not publish on invalid event types', () => {
    service.handleDiscovery(
      advert(testAddress, '5020aa014e64aed0a8654c0a11015d')
    );
    expect(entitiesService.get).not.toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalled();
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('Unknown event type'),
      'XiaomiMiService'
    );
  });

  it('should publish negative temperatures', () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);
    service.handleDiscovery(
      advert(testAddress, serviceData.negativeTemperature)
    );
    expect(sensor.state).toBe(-12.3);
  });

  it('should process repreated advertisements with different frame counters', async () => {
    const sensor = new Sensor('testid', 'Test', true, false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleDiscovery(advert(testAddress, serviceData.mifloraFert1));
    service.handleDiscovery(advert(testAddress, serviceData.mifloraFert2));
    expect(entitiesService.get).toHaveBeenCalledTimes(2);
  });

  it('should ignore repreated advertisements with the same frame counter', async () => {
    service.handleDiscovery(advert(testAddress, serviceData.mifloraFert1));
    service.handleDiscovery(advert(testAddress, serviceData.mifloraFert1));
    expect(entitiesService.get).toHaveBeenCalledTimes(1);
  });

  it('should poll battery for miflora sensors if global MiFlora Battery config enabled', async () => {
    const batteryCheckSpy = jest.spyOn(service, 'checkMifloraBattery');

    mockConfig.enableMifloraBattery = false;
    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert1)
    );
    expect(batteryCheckSpy).not.toHaveBeenCalled();

    mockConfig.enableMifloraBattery = true;
    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert2)
    );
    expect(batteryCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('should overide global MiFlora Battery config with local config if available', async () => {
    const batteryCheckSpy = jest.spyOn(service, 'checkMifloraBattery');

    mockConfig.enableMifloraBattery = false;
    mockConfig.sensors[0].enableMifloraBattery = true;
    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert1)
    );
    expect(batteryCheckSpy).toHaveBeenCalledTimes(1);

    mockConfig.enableMifloraBattery = true;
    mockConfig.sensors[0].enableMifloraBattery = false;
    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert2)
    );
    expect(batteryCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('should refresh battery within one hour of start-up', async () => {
    jest.useFakeTimers();

    const fertSensor = new Sensor('fertid', 'Fert', true, false);
    const battSensor = new Sensor('battid', 'batt', true, false);

    mockConfig.enableMifloraBattery = true;
    entitiesService.get
      .mockReturnValueOnce(fertSensor)
      .mockReturnValueOnce(fertSensor)
      .mockReturnValueOnce(battSensor);
    bluetoothService.queryLowEnergyDevice.mockResolvedValue(Buffer.from([42]));

    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert1)
    );
    expect(bluetoothService.queryLowEnergyDevice).not.toBeCalled();
    expect(entitiesService.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(60 * 60 * 1000);

    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert2)
    );
    expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(1);
    expect(entitiesService.get).toHaveBeenCalledTimes(3);
    expect(battSensor.state).toBe(42);
  });

  it('should refresh battery approximately every 24 hours following start-up period', async () => {
    jest.useFakeTimers();

    mockConfig.enableMifloraBattery = true;
    const target = advert(testAddress, serviceData.mifloraFert1);

    for (let i = 0; i < 24; i++) {
      await service.handleDiscovery(target);
      jest.advanceTimersByTime(1 * 60 * 60 * 1000);
      target.advertisement.serviceData[0].data[FRAME_COUNTER_INDEX]++;
    }
    expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(1);

    // Allow two hours to cover start-up period (+1h) and variable window (+1h)
    jest.advanceTimersByTime(2 * 60 * 60 * 1000);
    target.advertisement.serviceData[0].data[FRAME_COUNTER_INDEX]++;

    await service.handleDiscovery(target);
    expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(2);
  });

  it('should not publish battery sensor when BLE battery query fails', async () => {
    jest.useFakeTimers();

    mockConfig.enableMifloraBattery = true;

    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert1)
    );
    expect(entitiesService.get).toHaveBeenCalledTimes(1);
    expect(bluetoothService.queryLowEnergyDevice).not.toBeCalled();
    expect(loggerService.warn).not.toHaveBeenCalled();

    bluetoothService.queryLowEnergyDevice.mockRejectedValueOnce(
      new Error('Aborted Query')
    );
    jest.advanceTimersByTime(60 * 60 * 1000);

    await service.handleDiscovery(
      advert(testAddress, serviceData.mifloraFert2)
    );
    expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(1);
    expect(entitiesService.get).toHaveBeenCalledTimes(2); // +1 for the fertility sensor but not battery
    expect(loggerService.warn).toHaveBeenCalledTimes(1);
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Error reading battery level'),
      'XiaomiMiService'
    );
  });

  it('should retry battery query up to three times before aborting', async () => {
    jest.useFakeTimers();

    mockConfig.enableMifloraBattery = true;
    bluetoothService.queryLowEnergyDevice.mockResolvedValue(null);

    const target = advert(testAddress, serviceData.mifloraFert1);

    await service.handleDiscovery(target);
    expect(bluetoothService.queryLowEnergyDevice).not.toBeCalled();

    jest.advanceTimersByTime(1 * 60 * 60 * 1000);

    for (let i = 1; i < 4; i++) {
      target.advertisement.serviceData[0].data[FRAME_COUNTER_INDEX]++;
      await service.handleDiscovery(target);
      expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(i);
    }

    target.advertisement.serviceData[0].data[FRAME_COUNTER_INDEX]++;
    await service.handleDiscovery(target);
    expect(bluetoothService.queryLowEnergyDevice).toHaveBeenCalledTimes(3);
  });
});
