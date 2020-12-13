const mockExec = jest.fn();
const mockNoble = {
  state: 'poweredOn',
  on: jest.fn(),
  startScanningAsync: jest.fn(),
  stopScanning: jest.fn(),
};
jest.mock(
  '@mkerix/noble',
  () => {
    return mockNoble;
  },
  { virtual: true }
);

import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothService } from './bluetooth.service';
import { ConfigModule } from '../../config/config.module';
import { BluetoothHealthIndicator } from './bluetooth.health';
import { Peripheral } from '@mkerix/noble';

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
    it('should return measured RSSI value from command output', async () => {
      mockExec.mockResolvedValue({ stdout: 'RSSI return value: -4' });

      const address = '77:50:fb:4d:ab:70';

      expect(await service.inquireClassicRssi(1, address)).toBe(-4);
      expect(mockExec).toHaveBeenCalledWith(
        `hcitool -i hci1 cc \"${address}\" && hcitool -i hci1 rssi \"${address}\"`,
        expect.anything()
      );
    });

    it('should return undefined if no RSSI could be determined', async () => {
      mockExec.mockResolvedValue({
        stdout: "Can't create connection: Input/output error",
        stderr: 'Not connected.',
      });

      expect(
        await service.inquireClassicRssi(0, '08:05:90:ed:3b:60')
      ).toBeUndefined();
    });

    it('should return undefined if the command failed', async () => {
      mockExec.mockRejectedValue({ message: 'Command failed' });

      expect(
        await service.inquireClassicRssi(0, '08:05:90:ed:3b:60')
      ).toBeUndefined();
    });

    it('should throw an exception if an inquiry is requested for a locked adapter', async () => {
      service.lockAdapter(1);

      await expect(
        service.inquireClassicRssi(1, '77:50:fb:4d:ab:71')
      ).rejects.toThrow();
    });

    it('should reset the HCI device if the query took too long', async () => {
      mockExec.mockRejectedValue({ signal: 'SIGKILL' });

      const result = await service.inquireClassicRssi(1, '08:05:90:ed:3b:60');
      expect(result).toBeUndefined();
      expect(mockExec).toHaveBeenCalledWith('hciconfig hci1 reset');
    });

    it('should stop scanning on an adapter while performing an inquiry', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      await stateChangeHandler('poweredOn');

      expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(1);

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service.inquireClassicRssi(0, 'x').then(() => {
        expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(2);
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

      expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(2);
    });

    it('should stop scanning on an adapter while getting Classic device info', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      await stateChangeHandler('poweredOn');

      expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(1);

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service
        .inquireClassicDeviceInfo(0, 'x')
        .then(() => {
          expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(2);
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

      expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(1);
    });

    it('should not enable scanning when the adapter is performing a Classic inquiry', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service.inquireClassicRssi(0, 'x').then(() => {
        expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(1);
      });

      stateChangeHandler('poweredOn');

      expect(mockNoble.startScanningAsync).not.toHaveBeenCalled();

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

      expect(mockNoble.startScanningAsync).toHaveBeenCalledTimes(1);
      expect(mockNoble.stopScanning).not.toHaveBeenCalled();
    });

    it('should throw an exception if trying to connect to a non-connectable peripheral', async () => {
      const peripheral = {
        connectable: false,
      } as Peripheral;

      await expect(async () => {
        await service.connectLowEnergyDevice(peripheral);
      }).rejects.toThrow();
    });

    it('should only allow a single connection on an adapter', async () => {
      let connectResolve;
      const connectPromise = new Promise((r) => (connectResolve = r));

      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockReturnValue(connectPromise),
        once: jest.fn(),
      };

      service.connectLowEnergyDevice((peripheral as unknown) as Peripheral);

      await expect(
        service.connectLowEnergyDevice((peripheral as unknown) as Peripheral)
      ).rejects.toThrow();

      connectResolve();
    });

    it('should unlock the adapter on disconnect', async () => {
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      };

      await service.connectLowEnergyDevice(
        (peripheral as unknown) as Peripheral
      );

      const disconnectListener = peripheral.once.mock.calls[0][1];
      disconnectListener();

      await expect(async () => {
        await service.connectLowEnergyDevice(
          (peripheral as unknown) as Peripheral
        );
      }).not.toThrow();
    });

    it('should clean up if an exception occurs while connecting', async () => {
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockRejectedValue(new Error('expected')),
        disconnect: jest.fn(),
        removeAllListeners: jest.fn(),
        once: jest.fn(),
      };

      await expect(async () => {
        await service.connectLowEnergyDevice(
          (peripheral as unknown) as Peripheral
        );
      }).rejects.toThrow();

      expect(mockExec).toHaveBeenCalledWith(expect.stringContaining('reset'));
      expect(peripheral.removeAllListeners).toHaveBeenCalled();
    });

    it('should limit the connection attempt time', () => {
      expect.assertions(1);
      jest.useFakeTimers('modern');

      const peripheral = {
        connectable: true,
        connectAsync: jest
          .fn()
          .mockReturnValue(
            new Promise((resolve) => setTimeout(resolve, 11 * 1000))
          ),
        disconnect: jest.fn(),
        removeAllListeners: jest.fn(),
        once: jest.fn(),
      };

      const promise = service
        .connectLowEnergyDevice((peripheral as unknown) as Peripheral)
        .catch((e) => {
          expect(e).toStrictEqual(new Error('timed out'));
        });
      jest.advanceTimersByTime(10.5 * 1000);

      return promise;
    });

    it('should return the peripheral after connecting', async () => {
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      };

      const actual = await service.connectLowEnergyDevice(
        (peripheral as unknown) as Peripheral
      );

      expect(actual).toBe(peripheral);
    });

    it('should disconnect from a peripheral', async () => {
      const peripheral = {
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
      };

      await service.disconnectLowEnergyDevice(
        (peripheral as unknown) as Peripheral
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
    });
  });

  it('should reset adapters that have been locked for too long', () => {
    jest.useFakeTimers('modern');

    service.lockAdapter(0); // should time out

    service.unlockAdapter(1); // already unlocked
    jest.setSystemTime(Date.now() + 31 * 1000);
    service.lockAdapter(2); // should not time out

    service.resetDeadlockedAdapters();

    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith('hciconfig hci0 reset');
  });
});
