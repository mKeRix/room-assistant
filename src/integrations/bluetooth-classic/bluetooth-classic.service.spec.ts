import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothClassicService } from './bluetooth-classic.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { ScheduleModule } from '@nestjs/schedule';
import * as util from 'util';
import {
  NEW_RSSI_CHANNEL,
  REQUEST_RSSI_CHANNEL
} from './bluetooth-classic.const';
import { NewRssiEvent } from './new-rssi.event';
import { RoomPresenceDistanceSensor } from '../room-presence/room-presence-distance.sensor';
import KalmanFilter from 'kalmanjs';

jest.mock('child_process');
jest.mock('util');
jest.mock('../room-presence/room-presence-distance.sensor');
jest.mock('kalmanjs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: (z: number): number => z
    };
  });
});

describe('BluetoothClassicService', () => {
  let service: BluetoothClassicService;
  const entitiesService = {
    add: jest.fn(),
    get: jest.fn(),
    has: jest.fn()
  };
  const clusterService = {
    on: jest.fn(),
    nodes: jest.fn(),
    send: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
    isLeader: jest.fn()
  };
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        EntitiesModule,
        ClusterModule,
        ScheduleModule.forRoot()
      ],
      providers: [BluetoothClassicService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();
    module.useLogger(loggerService);

    service = module.get<BluetoothClassicService>(BluetoothClassicService);
  });

  it('should log an error if hcitool is not installed', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockRejectedValue({ stderr: 'hcitool not found' });
    });

    await service.onModuleInit();
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('could not be found'),
      expect.anything(),
      BluetoothClassicService.name
    );
  });

  it('should not log an error if hcitool is found', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: 'hcitool help' });
    });

    await service.onModuleInit();
    expect(loggerService.error).not.toHaveBeenCalled();
  });

  it('should setup the cluster bindings on bootstrap', () => {
    service.onApplicationBootstrap();

    expect(clusterService.on).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      expect.anything()
    );
    expect(clusterService.on).toHaveBeenCalledWith(
      NEW_RSSI_CHANNEL,
      expect.anything()
    );
    expect(clusterService.subscribe).toHaveBeenCalledWith(NEW_RSSI_CHANNEL);
  });

  it('should return measured RSSI value from command output', () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: 'RSSI return value: -4' });
    });

    const address = '77:50:fb:4d:ab:70';

    expect(service.inquireRssi(address)).resolves.toBe(-4);
  });

  it('should return undefined if no RSSI could be determined', () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({
        stdout: "Can't create connection: Input/output error",
        stderr: 'Not connected.'
      });
    });

    expect(service.inquireRssi('08:05:90:ed:3b:60')).resolves.toBeUndefined();
  });

  it('should return device information based on parsed output', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({
        stdout: `
Requesting information ...
\tBD Address:  F0:99:B6:12:34:AB
\tOUI Company: Apple, Inc. (F0-99-B6)
\tDevice Name: Test iPhone
\tLMP Version: 5.0 (0x9) LMP Subversion: 0x4307
\tManufacturer: Broadcom Corporation (15)
\tFeatures page 0:
\tFeatures page 1:
\tFeatures page 2:
      `
      });
    });

    expect(await service.inquireDeviceInfo('F0:99:B6:12:34:AB')).toStrictEqual({
      address: 'F0:99:B6:12:34:AB',
      name: 'Test iPhone',
      manufacturer: 'Apple, Inc.'
    });
  });

  it('should return barebones information if request fails', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockRejectedValue({ stderr: 'I/O Error' });
    });

    expect(await service.inquireDeviceInfo('F0:99:B6:12:34:CD')).toStrictEqual({
      address: 'F0:99:B6:12:34:CD',
      name: 'F0:99:B6:12:34:CD'
    });
  });

  it('should publish the RSSI if found', async () => {
    jest.spyOn(service, 'inquireRssi').mockResolvedValue(0);
    const handleRssiMock = jest
      .spyOn(service, 'handleNewRssi')
      .mockImplementation(() => undefined);

    const address = '77:50:fb:4d:ab:70';
    const expectedEvent = new NewRssiEvent('test-instance', address, 0);

    await service.handleRssiRequest(address);
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_RSSI_CHANNEL,
      expectedEvent
    );
    expect(handleRssiMock).toHaveBeenCalledWith(expectedEvent);
  });

  it('should not publish an RSSI value if none was found', async () => {
    jest.spyOn(service, 'inquireRssi').mockResolvedValue(undefined);
    const handleRssiMock = jest
      .spyOn(service, 'handleNewRssi')
      .mockImplementation(() => undefined);

    await service.handleRssiRequest('77:50:fb:4d:ab:70');

    expect(clusterService.publish).not.toHaveBeenCalled();
    expect(handleRssiMock).not.toHaveBeenCalled();
  });

  it('should register a new sensor for a previously unknown device', async () => {
    entitiesService.has.mockReturnValue(false);
    entitiesService.add.mockImplementation(entity => entity);
    clusterService.nodes.mockReturnValue({
      abcd: { channels: [NEW_RSSI_CHANNEL] }
    });
    jest.spyOn(service, 'inquireDeviceInfo').mockResolvedValue({
      address: '10:36:cf:ca:9a:18',
      name: 'Test iPhone'
    });
    jest.useFakeTimers();

    const event = new NewRssiEvent('test-instance', '10:36:cf:ca:9a:18', -10);
    await service.handleNewRssi(event);

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.any(RoomPresenceDistanceSensor),
      expect.any(Array)
    );
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);

    const sensorInstance = (RoomPresenceDistanceSensor as jest.Mock).mock
      .instances[0];
    expect(sensorInstance.handleNewDistance).toHaveBeenCalledWith(
      'test-instance',
      10
    );
    expect(sensorInstance.timeout).toBe(40);
  });

  it('should not distribute inquiries if not the leader', () => {
    clusterService.isLeader.mockReturnValue(false);
    const inquireSpy = jest.spyOn(service, 'inquireRssi');

    service.distributeInquiries();
    expect(clusterService.send).not.toHaveBeenCalled();
    expect(inquireSpy).not.toHaveBeenCalled();
  });

  it('should rotate inquiries correctly when there are more addresses than nodes', () => {
    clusterService.nodes.mockReturnValue({
      abcd: { channels: [NEW_RSSI_CHANNEL] }
    });
    clusterService.isLeader.mockReturnValue(true);
    const rssiRequestSpy = jest
      .spyOn(service, 'handleRssiRequest')
      .mockImplementation(() => undefined);

    service.distributeInquiries();
    expect(rssiRequestSpy).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');

    service.distributeInquiries();
    expect(rssiRequestSpy).toHaveBeenLastCalledWith('f7:6c:e3:10:55:b5');

    service.distributeInquiries();
    expect(rssiRequestSpy).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');
  });

  it('should rotate inquiries correctly when there are exactly as many addresses as nodes', () => {
    clusterService.nodes.mockReturnValue({
      abcd: { id: 'abcd', channels: [NEW_RSSI_CHANNEL] },
      def: { id: 'def', channels: [NEW_RSSI_CHANNEL], last: new Date() }
    });
    clusterService.isLeader.mockReturnValue(true);
    const handleRssiRequest = jest
      .spyOn(service, 'handleRssiRequest')
      .mockImplementation(() => undefined);

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');
    expect(clusterService.send).toHaveBeenLastCalledWith(
      REQUEST_RSSI_CHANNEL,
      'f7:6c:e3:10:55:b5',
      'def'
    );

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenLastCalledWith('f7:6c:e3:10:55:b5');
    expect(clusterService.send).toHaveBeenLastCalledWith(
      REQUEST_RSSI_CHANNEL,
      '8d:ad:e3:e2:7a:01',
      'def'
    );

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');
    expect(clusterService.send).toHaveBeenLastCalledWith(
      REQUEST_RSSI_CHANNEL,
      'f7:6c:e3:10:55:b5',
      'def'
    );
  });

  it('should rotate inquiries correctly when there are more nodes than addresses', () => {
    clusterService.nodes.mockReturnValue({
      abcd: { id: 'abcd', channels: [NEW_RSSI_CHANNEL] },
      def: { id: 'def', channels: [NEW_RSSI_CHANNEL], last: new Date() },
      xyz: { id: 'xyz', channels: [NEW_RSSI_CHANNEL], last: new Date() }
    });
    clusterService.isLeader.mockReturnValue(true);
    const handleRssiRequest = jest
      .spyOn(service, 'handleRssiRequest')
      .mockImplementation(() => undefined);

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');
    expect(clusterService.send).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      'f7:6c:e3:10:55:b5',
      'def'
    );
    expect(clusterService.send).toHaveBeenCalledTimes(1);
    handleRssiRequest.mockClear();
    clusterService.send.mockClear();

    service.distributeInquiries();
    expect(handleRssiRequest).not.toHaveBeenCalled();
    expect(clusterService.send).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      '8d:ad:e3:e2:7a:01',
      'def'
    );
    expect(clusterService.send).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      'f7:6c:e3:10:55:b5',
      'xyz'
    );
    expect(clusterService.send).toHaveBeenCalledTimes(2);
    handleRssiRequest.mockClear();
    clusterService.send.mockClear();

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenCalledWith('f7:6c:e3:10:55:b5');
    expect(clusterService.send).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      '8d:ad:e3:e2:7a:01',
      'xyz'
    );
    expect(clusterService.send).toHaveBeenCalledTimes(1);
    handleRssiRequest.mockClear();
    clusterService.send.mockClear();

    service.distributeInquiries();
    expect(handleRssiRequest).toHaveBeenLastCalledWith('8d:ad:e3:e2:7a:01');
    expect(clusterService.send).toHaveBeenCalledWith(
      REQUEST_RSSI_CHANNEL,
      'f7:6c:e3:10:55:b5',
      'def'
    );
    expect(clusterService.send).toHaveBeenCalledTimes(1);
  });

  it('should only account for nodes that have the integration enabled', () => {
    clusterService.nodes.mockReturnValue({
      abcd: { id: 'abcd', channels: [NEW_RSSI_CHANNEL] },
      def: { id: 'def', channels: [NEW_RSSI_CHANNEL], last: new Date() },
      xyz: { id: 'xyz', last: new Date() }
    });

    const nodes = service.getParticipatingNodes();
    expect(nodes).toHaveLength(2);
    expect(nodes.find(node => node.id === 'abcd')).not.toBeUndefined();
    expect(nodes.find(node => node.id === 'def')).not.toBeUndefined();
    expect(nodes.find(node => node.id === 'xyz')).toBeUndefined();
  });

  it('should filter the RSSI of inquired devices before publishing', async () => {
    jest.spyOn(service, 'inquireRssi').mockResolvedValue(-3);
    const handleRssiMock = jest
      .spyOn(service, 'handleNewRssi')
      .mockImplementation(() => undefined);
    const filterRssiMock = jest
      .spyOn(service, 'filterRssi')
      .mockReturnValue(-5.2);

    const address = 'ab:cd:01:23:00:70';
    const expectedEvent = new NewRssiEvent('test-instance', address, -5.2);

    await service.handleRssiRequest(address);
    expect(filterRssiMock).toHaveBeenCalled();
    expect(clusterService.publish).toHaveBeenCalledWith(
      NEW_RSSI_CHANNEL,
      expectedEvent
    );
    expect(handleRssiMock).toHaveBeenCalledWith(expectedEvent);
  });

  it('should reuse Kalman filters for the same address', () => {
    service.filterRssi('D6:AB:CD:10:DA:31', -1);
    service.filterRssi('D6:AB:CD:10:DA:41', -4);
    service.filterRssi('D6:AB:CD:10:DA:31', -2);

    expect(KalmanFilter).toHaveBeenCalledTimes(2);
  });
});
