jest.mock('kalmanjs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: (z: number): number => z,
    };
  });
});

import { Peripheral } from '@abandonware/noble';
import { ConfigService } from '../../config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BluetoothLowEnergyService,
  NEW_DISTANCE_CHANNEL,
} from './bluetooth-low-energy.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ClusterService } from '../../cluster/cluster.service';
import { EntitiesService } from '../../entities/entities.service';
import { BluetoothLowEnergyConfig } from './bluetooth-low-energy.config';
import { Sensor } from '../../entities/sensor';
import c from 'config';
import { NewDistanceEvent } from './new-distance.event';
import { BluetoothLowEnergyPresenceSensor } from './bluetooth-low-energy-presence.sensor';
import KalmanFilter from 'kalmanjs';
import { DeviceTracker } from '../../entities/device-tracker';
import * as util from 'util';
import { BluetoothService } from '../bluetooth/bluetooth.service';
import { BluetoothModule } from '../bluetooth/bluetooth.module';

jest.useFakeTimers();

describe('BluetoothLowEnergyService', () => {
  let service: BluetoothLowEnergyService;
  const bluetoothService = {
    onLowEnergyDiscovery: jest.fn(),
  };
  const clusterService = {
    on: jest.fn(),
    subscribe: jest.fn(),
    publish: jest.fn(),
  };
  const entitiesService = {
    has: jest.fn(),
    get: jest.fn(),
    add: jest.fn(),
  };
  let mockConfig: Partial<BluetoothLowEnergyConfig> = {
    tagOverrides: {},
  };
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'bluetoothLowEnergy' ? mockConfig : c.get(key);
    }),
  };
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const iBeaconData = Buffer.from([
    76,
    0,
    2,
    21,
    47,
    35,
    68,
    84,
    207,
    109,
    74,
    15,
    173,
    242,
    244,
    145,
    27,
    169,
    255,
    166,
    0,
    1,
    0,
    2,
    204,
  ]);

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfig = { tagOverrides: {} };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BluetoothModule,
        ConfigModule,
        ClusterModule,
        EntitiesModule,
        ScheduleModule.forRoot(),
      ],
      providers: [BluetoothLowEnergyService],
    })
      .overrideProvider(BluetoothService)
      .useValue(bluetoothService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();
    module.useLogger(loggerService);

    service = module.get<BluetoothLowEnergyService>(BluetoothLowEnergyService);
  });

  it('should setup BLE listener on bootstrap', () => {
    service.onApplicationBootstrap();
    expect(bluetoothService.onLowEnergyDiscovery).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should warn if no whitelist has been configured', () => {
    mockConfig.whitelist = ['abcd'];
    service.onModuleInit();
    expect(loggerService.warn).not.toHaveBeenCalled();

    mockConfig.whitelist = [];
    service.onModuleInit();
    expect(loggerService.warn).toHaveBeenCalled();
  });

  it('should setup cluster listeners on bootstrap', () => {
    service.onApplicationBootstrap();
    expect(clusterService.on).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expect.any(Function)
    );
    expect(clusterService.subscribe).toHaveBeenCalledWith(NEW_DISTANCE_CHANNEL);
  });

  it('should detect iBeacons based on their manufacturer data', () => {
    expect(service.isIBeacon(iBeaconData)).toBeTruthy();
    expect(service.isIBeacon(Buffer.from([123, 12, 51, 6]))).toBeFalsy();
  });

  it('should ignore tags that are not iBeacons if only those should be processed', () => {
    mockConfig.processIBeacon = true;
    mockConfig.onlyIBeacon = true;

    service.handleDiscovery({
      advertisement: {
        manufacturerData: Buffer.from([1, 2, 3]),
      },
    } as Peripheral);
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should publish iBeacon distance changes', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    mockConfig.onlyIBeacon = true;
    mockConfig.processIBeacon = true;

    service.handleDiscovery({
      id: 'abcd1234',
      rssi: -50,
      advertisement: {
        localName: 'Test Beacon',
        txPowerLevel: -72,
        manufacturerData: iBeaconData,
      },
    } as Peripheral);

    const expectedEvent = new NewDistanceEvent(
      'test-instance',
      '2f234454cf6d4a0fadf2f4911ba9ffa6-1-2',
      'Test Beacon',
      -50,
      -52,
      0.7
    );
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );
  });

  it('should not process iBeacon data if disabled in the config', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    mockConfig.processIBeacon = false;
    service.handleDiscovery({
      id: 'abcd1234',
      rssi: -59,
      advertisement: {
        localName: 'Test Beacon',
        txPowerLevel: -59,
        manufacturerData: iBeaconData,
      },
    } as Peripheral);

    const expectedEvent = new NewDistanceEvent(
      'test-instance',
      'abcd1234',
      'Test Beacon',
      -59,
      -59,
      1
    );
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );
  });

  it('should publish distance changes for normal BLE devices', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    service.handleDiscovery({
      id: '123-123',
      rssi: -81,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    const expectedEvent = new NewDistanceEvent(
      'test-instance',
      '123-123',
      'Test BLE Device',
      -81,
      -59,
      10.5
    );
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );
  });

  it('should ignore devices that are not on the whitelist', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.whitelist = ['123-1-1'];

    service.handleDiscovery({
      id: '123-1-2',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should not publish anything if the whitelist and blacklist are empty', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.whitelist = [];
    mockConfig.blacklist = [];

    service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should not publish anything if the device is on the blacklist', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.whitelist = ['89:47:65', 'abcd'];
    mockConfig.blacklist = ['89:47:65'];

    service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should publish all devices not on blacklist if there is no whitelist', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.whitelist = [];
    mockConfig.blacklist = ['89:47:65'];

    service.handleDiscovery({
      id: 'abcd',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).toHaveBeenCalled();
    expect(clusterService.publish).toHaveBeenCalled();
  });

  it('should not publish devices on blacklist if there is no whitelist', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.whitelist = [];
    mockConfig.blacklist = ['89:47:65'];

    service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should apply tag distance override if it exists', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);
    mockConfig.tagOverrides = {
      abcd: {
        measuredPower: -80,
      },
    };

    service.handleDiscovery({
      id: 'abcd',
      rssi: -81,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    const expectedEvent = new NewDistanceEvent(
      'test-instance',
      'abcd',
      'Test BLE Device',
      -81,
      -80,
      1.1
    );
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );

    service.handleDiscovery({
      id: 'defg',
      rssi: -81,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expectedEvent.tagId = 'defg';
    expectedEvent.distance = 10.5;
    expectedEvent.measuredPower = -59;
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );
  });

  it('should apply a tag name override if it exists', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);
    mockConfig.tagOverrides = {
      abcd: {
        name: 'better name',
      },
    };

    service.handleDiscovery({
      id: 'abcd',
      rssi: -12,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tagName: 'better name',
      })
    );
  });

  it('should not publish state changes for devices that are not on the whitelist', () => {
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(false);

    service.handleDiscovery({
      id: 'abcd',
      rssi: -30,
      advertisement: {},
    } as Peripheral);

    expect(entitiesService.has).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should match ids to a normal whitelist', () => {
    mockConfig.whitelist = ['vip-id', 'vip2-id'];

    expect(service.isOnWhitelist('vip-id')).toBeTruthy();
    expect(service.isOnWhitelist('random-id')).toBeFalsy();
  });

  it('should match ids to a regex whitelist', () => {
    mockConfig.whitelist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.whitelistRegex = true;

    expect(service.isOnWhitelist('vip-def')).toBeTruthy();
    expect(service.isOnWhitelist('asvip-abcd')).toBeTruthy();
    expect(service.isOnWhitelist('123')).toBeTruthy();
    expect(service.isOnWhitelist('test')).toBeFalsy();
    expect(service.isOnWhitelist('test123')).toBeFalsy();
  });

  it('should match ids to a normal blacklist', () => {
    mockConfig.blacklist = ['vip-id', 'vip2-id'];

    expect(service.isOnBlacklist('vip-id')).toBeTruthy();
    expect(service.isOnBlacklist('random-id')).toBeFalsy();
  });

  it('should match ids to a regex blacklist', () => {
    mockConfig.blacklist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.blacklistRegex = true;

    expect(service.isOnBlacklist('vip-def')).toBeTruthy();
    expect(service.isOnBlacklist('asvip-abcd')).toBeTruthy();
    expect(service.isOnBlacklist('123')).toBeTruthy();
    expect(service.isOnBlacklist('test')).toBeFalsy();
    expect(service.isOnBlacklist('test123')).toBeFalsy();
  });

  it('should filter the measured RSSI of the peripherals', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    const filterSpy = jest.spyOn(service, 'filterRssi').mockReturnValue(-50);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -45,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(filterSpy).toHaveBeenCalledWith('12:ab:cd:12:cd', -45);
    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        distance: 0.2,
      })
    );
  });

  it('should report peripherals that are closer than the max distance normally', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);
    mockConfig.maxDistance = 5;

    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -45,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        outOfRange: false,
      })
    );
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expect.objectContaining({
        outOfRange: false,
      })
    );
  });

  it('should mark peripherals that are further away than max distance as out of range', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);
    mockConfig.maxDistance = 5;

    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -89,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        outOfRange: true,
      })
    );
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expect.objectContaining({
        outOfRange: true,
      })
    );
  });

  it('should throttle distance reporting if updateFrequency is configured', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);
    mockConfig.updateFrequency = 10;
    const now = new Date();

    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -89,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    service.handleDiscovery({
      id: 'ab:ab:cd:cd:cd',
      rssi: -90,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -91,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledTimes(2);
    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        distance: 21.5,
      })
    );

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(now.setSeconds(now.getSeconds() + 11));
    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -100,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    expect(handleDistanceSpy).toHaveBeenCalledTimes(3);
    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        distance: 52.7,
      })
    );
  });

  it('should allow immediate updates if no updateFrequency was configured', () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -89,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    service.handleDiscovery({
      id: 'ab:ab:cd:cd:cd',
      rssi: -90,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -91,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledTimes(3);
  });

  it('should reuse existing Kalman filters for the same id', () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.has.mockReturnValue(true);
    entitiesService.get.mockReturnValue(sensor);
    jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isWhitelistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(true);

    service.handleDiscovery({
      id: 'id1',
      rssi: -45,
      advertisement: {},
    } as Peripheral);
    service.handleDiscovery({
      id: 'id2',
      rssi: -67,
      advertisement: {},
    } as Peripheral);
    service.handleDiscovery({
      id: 'id1',
      rssi: -56,
      advertisement: {},
    } as Peripheral);

    expect(KalmanFilter).toHaveBeenCalledTimes(2);
  });

  it('should pass distance information to existing room presence sensors', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(true);
    entitiesService.get.mockReturnValue(sensor);
    const sensorHandleSpy = jest.spyOn(sensor, 'handleNewDistance');

    service.handleNewDistance(
      new NewDistanceEvent('test-instance', 'test', 'Test', -80, -50, 2)
    );

    expect(sensorHandleSpy).toHaveBeenCalledWith('test-instance', 2, false);
  });

  it('should add new room presence sensor if no matching ones exist yet', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(false);
    entitiesService.add.mockReturnValue(sensor);
    mockConfig.timeout = 20;
    const sensorHandleSpy = jest.spyOn(sensor, 'handleNewDistance');

    service.handleNewDistance(
      new NewDistanceEvent('test-instance', 'new', 'New Tag', -80, -50, 1.3)
    );

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ble-new',
        name: 'New Tag Room Presence',
        timeout: 20,
      }),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new DeviceTracker('ble-new-tracker', 'New Tag', true)
    );
    expect(
      util.types.isProxy(entitiesService.add.mock.calls[1][0])
    ).toBeTruthy();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 20 * 1000);
    expect(sensorHandleSpy).toHaveBeenCalledWith('test-instance', 1.3, false);
  });

  it('should update the sensor RSSI and measuredPower information', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(true);
    entitiesService.get.mockReturnValue(sensor);

    service.handleNewDistance(
      new NewDistanceEvent('test-instance', 'test', 'Test', -80, -50, 2)
    );

    expect(sensor.measuredValues['test-instance'].rssi).toBe(-80);
    expect(sensor.measuredValues['test-instance'].measuredPower).toBe(-50);

    service.handleNewDistance(
      new NewDistanceEvent('test-instance-2', 'test', 'Test', -40, -45, 2)
    );
    service.handleNewDistance(
      new NewDistanceEvent('test-instance', 'test', 'Test', -70, -50, 2)
    );

    expect(sensor.measuredValues['test-instance-2'].rssi).toBe(-40);
    expect(sensor.measuredValues['test-instance-2'].measuredPower).toBe(-45);
    expect(sensor.measuredValues['test-instance'].rssi).toBe(-70);
    expect(sensor.measuredValues['test-instance'].measuredPower).toBe(-50);
  });

  it('should log the id of new peripherals that are found', () => {
    mockConfig.processIBeacon = true;
    jest.spyOn(service, 'isOnWhitelist').mockReturnValue(false);

    service.handleDiscovery({
      id: 'test-ibeacon-123',
      rssi: -50,
      advertisement: {
        localName: 'Test Beacon',
        manufacturerData: iBeaconData,
      },
    } as Peripheral);
    service.handleDiscovery({
      id: 'test-peripheral-456',
      rssi: -78,
      advertisement: {},
    } as Peripheral);
    service.handleDiscovery({
      id: 'test-ibeacon-123',
      rssi: -54,
      advertisement: {
        localName: 'Test Beacon',
        manufacturerData: iBeaconData,
      },
    } as Peripheral);

    expect(loggerService.log).toHaveBeenCalledTimes(2);
    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('2f234454cf6d4a0fadf2f4911ba9ffa6-1-2'),
      BluetoothLowEnergyService.name,
      expect.anything()
    );
    expect(loggerService.log).toHaveBeenCalledWith(
      expect.stringContaining('test-peripheral-456'),
      BluetoothLowEnergyService.name,
      expect.anything()
    );
  });
});
