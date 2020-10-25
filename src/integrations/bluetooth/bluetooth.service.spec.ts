const mockExec = jest.fn();
const mockNoble = {
  state: 'poweredOn',
  on: jest.fn(),
  startScanning: jest.fn(),
  stopScanning: jest.fn(),
};
jest.mock(
  '@abandonware/noble',
  () => {
    return mockNoble;
  },
  { virtual: true }
);

import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothService } from './bluetooth.service';
import { ConfigModule } from '../../config/config.module';
import { BluetoothHealthIndicator } from './bluetooth.health';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  promisify: () => mockExec,
}));
jest.useFakeTimers();

describe('BluetoothService', () => {
  let service: BluetoothService;
  const healthIndicator = {
    reportError: jest.fn(),
    reportSuccess: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [BluetoothService, BluetoothHealthIndicator],
    })
      .overrideProvider(BluetoothHealthIndicator)
      .useValue(healthIndicator)
      .compile();
    service = module.get<BluetoothService>(BluetoothService);
  });

  describe('Bluetooth Classic', () => {
    it('should return measured RSSI value from command output', () => {
      mockExec.mockResolvedValue({ stdout: 'RSSI return value: -4' });

      const address = '77:50:fb:4d:ab:70';

      expect(service.inquireClassicRssi(1, address)).resolves.toBe(-4);
      expect(mockExec).toHaveBeenCalledWith(
        `hcitool -i hci1 cc \"${address}\" && hcitool -i hci1 rssi \"${address}\"`,
        expect.anything()
      );
    });

    it('should return undefined if no RSSI could be determined', () => {
      mockExec.mockResolvedValue({
        stdout: "Can't create connection: Input/output error",
        stderr: 'Not connected.',
      });

      expect(
        service.inquireClassicRssi(0, '08:05:90:ed:3b:60')
      ).resolves.toBeUndefined();
    });

    it('should return undefined if the command failed', () => {
      mockExec.mockRejectedValue({ message: 'Command failed' });

      expect(
        service.inquireClassicRssi(0, '08:05:90:ed:3b:60')
      ).resolves.toBeUndefined();
    });

    it('should reset the HCI device if the query took too long', async () => {
      mockExec.mockRejectedValue({ signal: 'SIGKILL' });

      const result = await service.inquireClassicRssi(1, '08:05:90:ed:3b:60');
      expect(result).toBeUndefined();
      expect(mockExec).toHaveBeenCalledWith('hciconfig hci1 reset');
    });

    it('should stop scanning on an adapter while performing an inquiry', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      stateChangeHandler('poweredOn');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service.inquireClassicRssi(0, 'x').then(() => {
        expect(mockNoble.startScanning).toHaveBeenCalledTimes(2);
      });

      expect(mockNoble.stopScanning).toHaveBeenCalledTimes(1);

      execResolve({ stdout: '-1' });

      return inquirePromise;
    });

    it('should start scanning again even after encountering an exception', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      stateChangeHandler('poweredOn');

      mockExec.mockRejectedValue({ stderr: 'error' });
      await service.inquireClassicRssi(0, 'x');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(2);
    });

    it('should stop scanning on an adapter while getting Classic device info', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      stateChangeHandler('poweredOn');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service
        .inquireClassicDeviceInfo(0, 'x')
        .then(() => {
          expect(mockNoble.startScanning).toHaveBeenCalledTimes(2);
        });

      expect(mockNoble.stopScanning).toHaveBeenCalledTimes(1);

      execResolve({ stdout: '' });

      return inquirePromise;
    });

    it('should return device information based on parsed output', async () => {
      mockExec.mockResolvedValue({
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
      `,
      });

      expect(
        await service.inquireClassicDeviceInfo(0, 'F0:99:B6:12:34:AB')
      ).toStrictEqual({
        address: 'F0:99:B6:12:34:AB',
        name: 'Test iPhone',
        manufacturer: 'Apple, Inc.',
      });
    });

    it('should return the address as device name if none was found', async () => {
      mockExec.mockResolvedValue({
        stdout: 'IO error',
      });

      expect(
        await service.inquireClassicDeviceInfo(0, 'F0:99:B6:12:34:AB')
      ).toStrictEqual({
        address: 'F0:99:B6:12:34:AB',
        name: 'F0:99:B6:12:34:AB',
        manufacturer: undefined,
      });
    });

    it('should return barebones information if request fails', async () => {
      mockExec.mockRejectedValue({ stderr: 'I/O Error' });

      expect(
        await service.inquireClassicDeviceInfo(0, 'F0:99:B6:12:34:CD')
      ).toStrictEqual({
        address: 'F0:99:B6:12:34:CD',
        name: 'F0:99:B6:12:34:CD',
      });
    });

    it('should report success to the health indicator when queries are successful', async () => {
      mockExec.mockResolvedValue({ stdout: 'RSSI return value: -4' });
      await service.inquireClassicRssi(0, '');

      expect(healthIndicator.reportSuccess).toHaveBeenCalledTimes(1);
    });

    it('should report an error to the health indicator when queries are unsuccessful', async () => {
      mockExec.mockRejectedValue({ message: 'critical error' });
      await service.inquireClassicRssi(0, '');

      expect(healthIndicator.reportError).toHaveBeenCalledTimes(1);
    });

    it('should not report anything to the health indicator if the device was not reachable', async () => {
      mockExec.mockRejectedValue({
        message: 'Could not connect: Input/output error',
      });
      await service.inquireClassicRssi(0, '');

      expect(healthIndicator.reportSuccess).not.toHaveBeenCalled();
      expect(healthIndicator.reportError).not.toHaveBeenCalled();
    });

    it('should not report an error if the scan was stopped due to low time limits', async () => {
      mockExec.mockRejectedValue({
        message: 'killed',
        signal: 'SIGKILL',
      });
      await service.inquireClassicRssi(0, '');

      expect(healthIndicator.reportError).not.toHaveBeenCalled();
    });
  });

  describe('Bluetooth Low Energy', () => {
    it('should setup noble listeners on the first subscriber', () => {
      const callback = () => undefined;
      service.onLowEnergyDiscovery(callback);
      expect(mockNoble.on).toHaveBeenCalledWith(
        'stateChange',
        expect.any(Function)
      );
      expect(mockNoble.on).toHaveBeenCalledWith('discover', callback);
    });

    it('should only setup noble listeners once', () => {
      service.onLowEnergyDiscovery(() => undefined);
      service.onLowEnergyDiscovery(() => undefined);
      expect(mockNoble.on).toHaveBeenCalledTimes(4);
    });

    it('should enable scanning when the adapter is inactive', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];

      stateChangeHandler('poweredOn');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);
    });

    it('should not enable scanning when the adapter is performing a Classic inquiry', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service.inquireClassicRssi(0, 'x').then(() => {
        expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);
      });

      stateChangeHandler('poweredOn');

      expect(mockNoble.startScanning).not.toHaveBeenCalled();

      execResolve({ stdout: '-1' });

      return inquirePromise;
    });

    it('should continue scanning if Classic inquiries are performed on another adapter', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      stateChangeHandler('poweredOn');

      const execPromise = Promise.resolve({ stdout: '-1' });
      mockExec.mockReturnValue(execPromise);
      await service.inquireClassicRssi(1, 'x');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);
      expect(mockNoble.stopScanning).not.toHaveBeenCalled();
    });
  });
});
