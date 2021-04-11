jest.mock('mdns', () => ({}), { virtual: true });
jest.mock('kalmanjs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: (z: number): number => z,
    };
  });
});
jest.mock(
  '@mkerix/noble',
  () => {
    return {};
  },
  { virtual: true }
);
jest.mock(
  'bleno',
  () => {
    return {};
  },
  { virtual: true }
);

import { Peripheral } from '@mkerix/noble';
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
import { DeviceTrackerConfig } from '../home-assistant/device-tracker-config';
import * as util from 'util';
import { BluetoothService } from '../../integration-support/bluetooth/bluetooth.service';
import { BluetoothModule } from '../../integration-support/bluetooth/bluetooth.module';
import { Tag } from './tag';

jest.useFakeTimers();

describe('BluetoothLowEnergyService', () => {
  let service: BluetoothLowEnergyService;
  const bluetoothService = {
    lowEnergyAdapterId: 0,
    lowEnergyScanUptime: 16 * 1000,
    onLowEnergyDiscovery: jest.fn(),
    connectLowEnergyDevice: jest.fn(),
    disconnectLowEnergyDevice: jest.fn(),
    resetHciDevice: jest.fn(),
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
  let mockConfig: Partial<BluetoothLowEnergyConfig>;
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
    mockConfig = { tagOverrides: {}, rssiFactor: 1 };

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

  it('should warn if no allowlist has been configured', () => {
    mockConfig.allowlist = ['abcd'];
    service.onModuleInit();
    expect(loggerService.warn).not.toHaveBeenCalled();

    mockConfig.allowlist = [];
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

  it('should ignore tags that are not iBeacons if only those should be processed', async () => {
    mockConfig.processIBeacon = true;
    mockConfig.onlyIBeacon = true;

    await service.handleDiscovery({
      advertisement: {
        manufacturerData: Buffer.from([1, 2, 3]),
      },
    } as Peripheral);
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should publish iBeacon distance changes', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    mockConfig.onlyIBeacon = true;
    mockConfig.processIBeacon = true;

    await service.handleDiscovery({
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
      'abcd1234',
      false,
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

  it('should not process iBeacon data if disabled in the config', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    mockConfig.processIBeacon = false;
    await service.handleDiscovery({
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
      'abcd1234',
      false,
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

  it('should publish distance changes for normal BLE devices', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    await service.handleDiscovery({
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
      '123-123',
      false,
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

  it('should ignore devices that are not on the allowlist', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.allowlist = ['123-1-1'];

    await service.handleDiscovery({
      id: '123-1-2',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should not publish anything if the allowlist and denylist are empty', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.allowlist = [];
    mockConfig.denylist = [];

    await service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should not publish anything if the device is on the denylist', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.allowlist = ['89:47:65', 'abcd'];
    mockConfig.denylist = ['89:47:65'];

    await service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should publish all devices not on denylist if there is no allowlist', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.allowlist = [];
    mockConfig.denylist = ['89:47:65'];

    await service.handleDiscovery({
      id: 'abcd',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).toHaveBeenCalled();
    expect(clusterService.publish).toHaveBeenCalled();
  });

  it('should not publish devices on denylist if there is no allowlist', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    mockConfig.allowlist = [];
    mockConfig.denylist = ['89:47:65'];

    await service.handleDiscovery({
      id: '89:47:65',
      rssi: -82,
      advertisement: {},
    } as Peripheral);
    expect(handleDistanceSpy).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should apply tag distance override if it exists', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
    mockConfig.tagOverrides = {
      abcd: {
        measuredPower: -80,
      },
    };

    await service.handleDiscovery({
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
      'abcd',
      false,
      -81,
      -80,
      1.1
    );
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );

    await service.handleDiscovery({
      id: 'defg',
      rssi: -81,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expectedEvent.tagId = 'defg';
    expectedEvent.peripheralId = 'defg';
    expectedEvent.distance = 10.5;
    expectedEvent.measuredPower = -59;
    expect(handleDistanceSpy).toHaveBeenCalledWith(expectedEvent);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_DISTANCE_CHANNEL,
      expectedEvent
    );
  });

  it('should apply a tag id override if it exists', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    const allowlistSpy = jest
      .spyOn(service, 'isOnAllowlist')
      .mockReturnValue(true);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    mockConfig.tagOverrides = {
      abcd: {
        id: 'new-id',
      },
    };

    await service.handleDiscovery({
      id: 'abcd',
      rssi: -12,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tagId: 'new-id',
      })
    );
    expect(allowlistSpy).toHaveBeenCalledWith('abcd');
  });

  it('should apply a tag name override if it exists', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
    mockConfig.tagOverrides = {
      abcd: {
        name: 'better name',
      },
    };

    await service.handleDiscovery({
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

  it('should apply a tag batteryMask override for iBeacon if it exists', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    mockConfig.onlyIBeacon = true;
    mockConfig.processIBeacon = true;

    mockConfig.tagOverrides = {
      '2f234454cf6d4a0fadf2f4911ba9ffa6-1-25346': {
        batteryMask: 0x0000ff00,
      },
    };

    const iBeaconDataWith99Battery = Buffer.from(iBeaconData);
    iBeaconDataWith99Battery[22] = 99;

    await service.handleDiscovery({
      id: 'test-ibeacon',
      rssi: -50,
      advertisement: {
        localName: 'Test Beacon',
        manufacturerData: iBeaconDataWith99Battery,
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        batteryLevel: 99,
      })
    );
  });

  it('should not publish state changes for devices that are not on the allowlist', async () => {
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(false);

    await service.handleDiscovery({
      id: 'abcd',
      rssi: -30,
      advertisement: {},
    } as Peripheral);

    expect(entitiesService.has).not.toHaveBeenCalled();
    expect(clusterService.publish).not.toHaveBeenCalled();
  });

  it('should match ids to a normal allowlist', () => {
    mockConfig.allowlist = ['vip-id', 'vip2-id'];

    expect(service.isOnAllowlist('vip-id')).toBeTruthy();
    expect(service.isOnAllowlist('VIP2-id')).toBeTruthy();
    expect(service.isOnAllowlist('random-id')).toBeFalsy();
  });

  it('should match ids to a regex allowlist', () => {
    mockConfig.allowlist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.allowlistRegex = true;

    expect(service.isOnAllowlist('vip-def')).toBeTruthy();
    expect(service.isOnAllowlist('asvip-abcd')).toBeTruthy();
    expect(service.isOnAllowlist('123')).toBeTruthy();
    expect(service.isOnAllowlist('test')).toBeFalsy();
    expect(service.isOnAllowlist('test123')).toBeFalsy();
  });

  it('should match ids to the deprecated whitelist', () => {
    mockConfig.whitelist = ['vip-id', 'vip2-id'];

    expect(service.isOnAllowlist('vip-id')).toBeTruthy();
    expect(service.isOnAllowlist('VIP2-id')).toBeTruthy();
    expect(service.isOnAllowlist('random-id')).toBeFalsy();
  });

  it('should match ids to the deprecated regex whitelist', () => {
    mockConfig.whitelist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.whitelistRegex = true;

    expect(service.isOnAllowlist('vip-def')).toBeTruthy();
    expect(service.isOnAllowlist('asvip-abcd')).toBeTruthy();
    expect(service.isOnAllowlist('123')).toBeTruthy();
    expect(service.isOnAllowlist('test')).toBeFalsy();
    expect(service.isOnAllowlist('test123')).toBeFalsy();
  });

  it('should match ids to a normal denylist', () => {
    mockConfig.denylist = ['vip-id', 'vip2-id'];

    expect(service.isOnDenylist('vip-id')).toBeTruthy();
    expect(service.isOnDenylist('VIP2-id')).toBeTruthy();
    expect(service.isOnDenylist('random-id')).toBeFalsy();
  });

  it('should match ids to a regex denylist', () => {
    mockConfig.denylist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.denylistRegex = true;

    expect(service.isOnDenylist('vip-def')).toBeTruthy();
    expect(service.isOnDenylist('asvip-abcd')).toBeTruthy();
    expect(service.isOnDenylist('123')).toBeTruthy();
    expect(service.isOnDenylist('test')).toBeFalsy();
    expect(service.isOnDenylist('test123')).toBeFalsy();
  });

  it('should match ids to the deprecated blacklist', () => {
    mockConfig.blacklist = ['vip-id', 'vip2-id'];

    expect(service.isOnDenylist('vip-id')).toBeTruthy();
    expect(service.isOnDenylist('VIP2-id')).toBeTruthy();
    expect(service.isOnDenylist('random-id')).toBeFalsy();
  });

  it('should match ids to the deprecated regex blacklist', () => {
    mockConfig.blacklist = ['vip-[a-z]+', '^[1-9]+$'];
    mockConfig.blacklistRegex = true;

    expect(service.isOnDenylist('vip-def')).toBeTruthy();
    expect(service.isOnDenylist('asvip-abcd')).toBeTruthy();
    expect(service.isOnDenylist('123')).toBeTruthy();
    expect(service.isOnDenylist('test')).toBeFalsy();
    expect(service.isOnDenylist('test123')).toBeFalsy();
  });

  it('should apply the RSSI factor', async () => {
    mockConfig.rssiFactor = 0.9;

    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    await service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -70,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        distance: 1.6,
        rssi: -63,
      })
    );
  });

  it('should filter the measured RSSI of the peripherals', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    const filterSpy = jest.spyOn(service, 'filterRssi').mockReturnValue(-50);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    await service.handleDiscovery({
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

  it('should report peripherals that are closer than the max distance normally', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
    mockConfig.maxDistance = 5;

    await service.handleDiscovery({
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

  it('should mark peripherals that are further away than max distance as out of range', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
    mockConfig.maxDistance = 5;

    await service.handleDiscovery({
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

  it('should throttle distance reporting if updateFrequency is configured', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
    mockConfig.updateFrequency = 10;
    const now = new Date();

    await service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -89,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    await service.handleDiscovery({
      id: 'ab:ab:cd:cd:cd',
      rssi: -90,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    await service.handleDiscovery({
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
    await service.handleDiscovery({
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

  it('should allow immediate updates if no updateFrequency was configured', async () => {
    const handleDistanceSpy = jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    await service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -89,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    await service.handleDiscovery({
      id: 'ab:ab:cd:cd:cd',
      rssi: -90,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);
    await service.handleDiscovery({
      id: '12:ab:cd:12:cd',
      rssi: -91,
      advertisement: {
        localName: 'Test BLE Device',
      },
    } as Peripheral);

    expect(handleDistanceSpy).toHaveBeenCalledTimes(3);
  });

  it('should reuse existing Kalman filters for the same id', async () => {
    const sensor = new Sensor('testid', 'Test');
    entitiesService.has.mockReturnValue(true);
    entitiesService.get.mockReturnValue(sensor);
    jest
      .spyOn(service, 'handleNewDistance')
      .mockImplementation(() => undefined);
    jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

    await service.handleDiscovery({
      id: 'id1',
      rssi: -45,
      advertisement: {},
    } as Peripheral);
    await service.handleDiscovery({
      id: 'id2',
      rssi: -67,
      advertisement: {},
    } as Peripheral);
    await service.handleDiscovery({
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
      new NewDistanceEvent(
        'test-instance',
        'test',
        'Test',
        'test',
        false,
        -80,
        -50,
        2
      )
    );

    expect(sensorHandleSpy).toHaveBeenCalledWith('test-instance', 2, false);
  });

  it('should add new room presence sensor and device tracker if no matching ones exist yet', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(false);
    entitiesService.add.mockReturnValue(sensor);
    mockConfig.timeout = 20;
    const sensorHandleSpy = jest.spyOn(sensor, 'handleNewDistance');

    service.handleNewDistance(
      new NewDistanceEvent(
        'test-instance',
        'new',
        'New Tag',
        'new',
        false,
        -80,
        -50,
        1.3
      )
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
      new DeviceTracker('ble-new-tracker', 'New Tag Tracker', true),
      [
        {
          for: DeviceTrackerConfig,
          overrides: {
            device: {
              identifiers: 'new',
              name: 'New Tag',
              viaDevice: 'room-assistant-distributed',
            },
          },
        },
      ]
    );
    expect(
      util.types.isProxy(entitiesService.add.mock.calls[1][0])
    ).toBeTruthy();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 20 * 1000);
    expect(sensorHandleSpy).toHaveBeenCalledWith('test-instance', 1.3, false);
  });

  it('should add a new battery sensor and set the battery level', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(false);
    entitiesService.add.mockReturnValue(sensor);

    service.handleNewDistance(
      new NewDistanceEvent(
        'test-instance',
        'new',
        'New Tag',
        'new',
        false,
        -80,
        -50,
        1.3,
        false,
        99
      )
    );

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ble-new',
        name: 'New Tag Room Presence',
      }),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new DeviceTracker('ble-new-tracker', 'New Tag Tracker', true),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new Sensor('ble-new-battery', 'New Tag Battery', true),
      expect.any(Array)
    );
    expect(sensor.batteryLevel).toBe(99);
  });

  it('should update the sensor RSSI and measuredPower information', () => {
    const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
    entitiesService.has.mockReturnValue(true);
    entitiesService.get.mockReturnValue(sensor);

    service.handleNewDistance(
      new NewDistanceEvent(
        'test-instance',
        'test',
        'Test',
        'test',
        false,
        -80,
        -50,
        2
      )
    );

    expect(sensor.measuredValues['test-instance'].rssi).toBe(-80);
    expect(sensor.measuredValues['test-instance'].measuredPower).toBe(-50);

    service.handleNewDistance(
      new NewDistanceEvent(
        'test-instance-2',
        'test',
        'Test',
        'test',
        false,
        -40,
        -45,
        2
      )
    );
    service.handleNewDistance(
      new NewDistanceEvent(
        'test-instance',
        'test',
        'Test',
        'test',
        false,
        -70,
        -50,
        2
      )
    );

    expect(sensor.measuredValues['test-instance-2'].rssi).toBe(-40);
    expect(sensor.measuredValues['test-instance-2'].measuredPower).toBe(-45);
    expect(sensor.measuredValues['test-instance'].rssi).toBe(-70);
    expect(sensor.measuredValues['test-instance'].measuredPower).toBe(-50);
  });

  it('should log the id of new peripherals that are found', async () => {
    mockConfig.processIBeacon = true;
    jest.spyOn(service, 'isOnAllowlist').mockReturnValue(false);

    await service.handleDiscovery({
      id: 'test-ibeacon-123',
      rssi: -50,
      advertisement: {
        localName: 'Test Beacon',
        manufacturerData: iBeaconData,
      },
    } as Peripheral);
    await service.handleDiscovery({
      id: 'test-peripheral-456',
      rssi: -78,
      advertisement: {},
    } as Peripheral);
    await service.handleDiscovery({
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

  describe('Companion App', () => {
    const APPLE_MANUFACTURER_DATA = Buffer.from([
      0x4c,
      0x00,
      0x01,
      0x00,
      0x00,
      0x00,
      0x10,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
    ]);

    it('should ignore non-Apple advertisements', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest.spyOn(service, 'discoverCompanionAppId');

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: Buffer.from(Array(11).fill(0x00)),
        },
      } as Peripheral);

      expect(discoverSpy).not.toHaveBeenCalled();
    });

    it('should ignore non-connectable advertisements', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest.spyOn(service, 'discoverCompanionAppId');

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: false,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral);

      expect(discoverSpy).not.toHaveBeenCalled();
    });

    it('should ignore advertisements from devices without overflow area', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest.spyOn(service, 'discoverCompanionAppId');

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: Buffer.from([0x4c, 0x00, 0x00]),
        },
      } as Peripheral);

      expect(discoverSpy).not.toHaveBeenCalled();
    });

    it('should ignore advertisements from devices that do not advertise the right service in the overflow area', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest.spyOn(service, 'discoverCompanionAppId');
      const manufacturerData = Buffer.from(APPLE_MANUFACTURER_DATA);
      manufacturerData.set([0x01], 6);

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData,
        },
      } as Peripheral);

      expect(discoverSpy).not.toHaveBeenCalled();
    });

    it('should override tag ids with companion app IDs', async () => {
      const handleDistanceSpy = jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      jest.spyOn(service, 'discoverCompanionAppId').mockResolvedValue('app-id');

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral);

      expect(handleDistanceSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          tagId: 'app-id',
        })
      );
      expect(clusterService.publish).toHaveBeenCalledWith(
        NEW_DISTANCE_CHANNEL,
        expect.objectContaining({
          tagId: 'app-id',
        })
      );
    });

    it('should not override tag information if no companion app found', async () => {
      const handleDistanceSpy = jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      jest.spyOn(service, 'discoverCompanionAppId').mockResolvedValue(null);

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral);

      expect(handleDistanceSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          tagId: 'abcd1234',
        })
      );
      expect(clusterService.publish).toHaveBeenCalledWith(
        NEW_DISTANCE_CHANNEL,
        expect.objectContaining({
          tagId: 'abcd1234',
        })
      );
    });

    it('should cache discovered companion app IDs', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest
        .spyOn(service, 'discoverCompanionAppId')
        .mockResolvedValue('app-id');

      const peripheral = {
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral;

      await service.handleDiscovery(peripheral);
      await service.handleDiscovery(peripheral);

      expect(discoverSpy).toHaveBeenCalledTimes(1);
    });

    it('should publish discovered companion app IDs to the cluster', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      jest.spyOn(service, 'discoverCompanionAppId').mockResolvedValue('app-id');

      await service.handleDiscovery({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral);

      expect(clusterService.publish).toHaveBeenCalledWith(
        NEW_DISTANCE_CHANNEL,
        expect.objectContaining({
          tagId: 'app-id',
          peripheralId: 'abcd1234',
          isApp: true,
        })
      );
    });

    it('should fill companion app cache from distance events', async () => {
      const sensor = new BluetoothLowEnergyPresenceSensor('test', 'Test', 0);
      entitiesService.has.mockReturnValue(true);
      entitiesService.get.mockReturnValue(sensor);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest.spyOn(service, 'discoverCompanionAppId');

      await service.handleNewDistance(
        new NewDistanceEvent(
          'test-instance',
          'app-id',
          'Test',
          'peripheral-id',
          true,
          -80,
          -50,
          2
        )
      );

      await service.handleDiscovery({
        id: 'peripheral-id',
        rssi: -50,
        connectable: true,
        advertisement: {
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral);

      expect(discoverSpy).not.toHaveBeenCalled();
    });

    it('should temporarily denylist devices that error out from discovery attempts', async () => {
      jest.useFakeTimers('modern');
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);
      const discoverSpy = jest
        .spyOn(service, 'discoverCompanionAppId')
        .mockRejectedValue(new Error('expected for this test'));

      const peripheral = {
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as Peripheral;

      await service.handleDiscovery(peripheral);
      await service.handleDiscovery(peripheral);

      expect(discoverSpy).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(60 * 1000);

      await service.handleDiscovery(peripheral);

      expect(discoverSpy).toHaveBeenCalledTimes(2);
    });

    it('should reset the adapter when discovery attempts time out', async () => {
      jest
        .spyOn(service, 'handleNewDistance')
        .mockImplementation(() => undefined);
      jest.spyOn(service, 'isAllowlistEnabled').mockReturnValue(true);
      jest.spyOn(service, 'isOnAllowlist').mockReturnValue(true);

      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        discoverServicesAsync: jest
          .fn()
          .mockRejectedValue(new Error('timed out')),
        once: jest.fn(),
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
      } as unknown) as Peripheral;
      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      await service.handleDiscovery(peripheral);

      expect(bluetoothService.resetHciDevice).toHaveBeenCalledWith(
        bluetoothService.lowEnergyAdapterId
      );
    });

    it('should discover the companion app ID from the well known characteristic', async () => {
      const gattCharacteristic = {
        readAsync: jest.fn().mockResolvedValue(Buffer.from('app-id', 'utf-8')),
      };
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockResolvedValue([gattCharacteristic]),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        once: jest.fn(),
        removeListener: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      const actual = await service.discoverCompanionAppId(new Tag(peripheral));

      expect(actual).toBe('app-id');
    });

    it('should return null if device does not have characteristic', async () => {
      const gattService = {
        discoverCharacteristicsAsync: jest.fn().mockResolvedValue([]),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        removeListener: jest.fn(),
        once: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      const actual = await service.discoverCompanionAppId(new Tag(peripheral));

      expect(actual).toBeNull();
    });

    it('should return null if device does not have service', async () => {
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([]),
        removeListener: jest.fn(),
        once: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      const actual = await service.discoverCompanionAppId(new Tag(peripheral));

      expect(actual).toBeNull();
    });

    it('should return null if there is an error while discovering GATT information', async () => {
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockRejectedValue(new Error('expected for this test')),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        removeListener: jest.fn(),
        once: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      const actual = await service.discoverCompanionAppId(new Tag(peripheral));

      expect(actual).toBeNull();
    });

    it('should disconnect from the peripheral after a successful discovery', async () => {
      const gattCharacteristic = {
        readAsync: jest.fn().mockResolvedValue(Buffer.from('app-id', 'utf-8')),
      };
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockResolvedValue([gattCharacteristic]),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        removeListener: jest.fn(),
        once: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      await service.discoverCompanionAppId(new Tag(peripheral));

      expect(bluetoothService.disconnectLowEnergyDevice).toHaveBeenCalledWith(
        peripheral
      );
    });

    it('should disconnect from the peripheral after a failed discovery', async () => {
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockRejectedValue(new Error('expected for this test')),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        removeListener: jest.fn(),
        once: jest.fn(),
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      await service.discoverCompanionAppId(new Tag(peripheral));

      expect(bluetoothService.disconnectLowEnergyDevice).toHaveBeenCalledWith(
        peripheral
      );
    });

    it('should not disconnect from an already disconnecting peripheral', async () => {
      const gattCharacteristic = {
        readAsync: jest.fn().mockResolvedValue(Buffer.from('app-id', 'utf-8')),
      };
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockResolvedValue([gattCharacteristic]),
      };
      const peripheral = ({
        id: 'abcd1234',
        rssi: -50,
        connectable: true,
        advertisement: {
          localName: 'Test Beacon',
          txPowerLevel: -72,
          manufacturerData: APPLE_MANUFACTURER_DATA,
        },
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        removeListener: jest.fn(),
        once: jest.fn(),
        state: 'disconnecting',
      } as unknown) as Peripheral;

      bluetoothService.connectLowEnergyDevice.mockResolvedValue(peripheral);

      await service.discoverCompanionAppId(new Tag(peripheral));

      expect(bluetoothService.disconnectLowEnergyDevice).not.toHaveBeenCalled();
    });
  });
});
