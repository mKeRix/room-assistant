const mockExec = jest.fn();

import { Test, TestingModule } from '@nestjs/testing';
import { BluetoothService } from './bluetooth.service';
import { ConfigModule } from '../../config/config.module';
import { BluetoothHealthIndicator } from './bluetooth.health';
import noble, { Peripheral } from '@mkerix/noble';
import bleno from 'bleno';
import * as Promises from '../../util/promises';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { mocked } from 'ts-jest/utils';

jest.mock('util', () => ({
  ...(jest.requireActual('util') as Record<string, unknown>),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  promisify: () => mockExec,
}));

const mockNoble = mocked(noble);
const mockBleno = mocked(bleno);

describe('BluetoothService', () => {
  let service: BluetoothService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BluetoothService,
        BluetoothHealthIndicator,
        makeCounterProvider({
          name: 'bluetooth_le_advertisements_received_count',
          help: 'help',
        }),
      ],
    }).compile();
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

    it('should cancel the connection if the query took too long', async () => {
      mockExec
        .mockRejectedValueOnce({ signal: 'SIGKILL' })
        .mockResolvedValue({});

      const result = await service.inquireClassicRssi(1, '08:05:90:ed:3b:60');
      expect(result).toBeUndefined();
      expect(mockExec).toHaveBeenCalledWith(
        'hcitool -i hci1 cmd 0x01 0x0008',
        expect.anything()
      );
    });

    it('should stop scanning and advertising on an adapter while performing an inquiry', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      await stateChangeHandler('poweredOn');
      const scanStartHandler = mockNoble.on.mock.calls[5][1];
      scanStartHandler();

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);

      let execResolve;
      const execPromise = new Promise((r) => (execResolve = r));
      mockExec.mockReturnValue(execPromise);
      const inquirePromise = service.inquireClassicRssi(0, 'x').then(() => {
        expect(mockNoble.startScanning).toHaveBeenCalledTimes(2);
      });

      expect(mockNoble.stopScanning).toHaveBeenCalledTimes(1);
      expect(mockBleno.stopAdvertising).toHaveBeenCalledTimes(1);

      execResolve({ stdout: '-1' });

      return inquirePromise;
    });

    it('should start scanning again even after encountering an exception', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      await stateChangeHandler('poweredOn');

      mockExec.mockRejectedValue({ stderr: 'error' });
      await service.inquireClassicRssi(0, 'x');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(2);
    });

    it('should stop scanning and advertising on an adapter while getting Classic device info', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      await stateChangeHandler('poweredOn');
      const scanStartHandler = mockNoble.on.mock.calls[5][1];
      scanStartHandler();

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
      expect(mockBleno.stopAdvertising).toHaveBeenCalledTimes(1);

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

    it('should reset occurred error count when queries are successful', async () => {
      mockExec
        .mockRejectedValueOnce({ message: 'critical error' })
        .mockResolvedValue({ stdout: 'RSSI return value: -4' });
      await service.inquireClassicRssi(0, '');
      await service.inquireClassicRssi(0, '');

      expect(service.successiveErrorsOccurred).toBe(0);
    });

    it('should add to occurred error count when queries are unsuccessful', async () => {
      mockExec.mockRejectedValue({ message: 'critical error' });
      await service.inquireClassicRssi(0, '');

      expect(service.successiveErrorsOccurred).toBe(1);
    });

    it('should not change the occurred error count if the device was not reachable', async () => {
      mockExec
        .mockRejectedValueOnce({ message: 'critical error' })
        .mockRejectedValue({
          message: 'Could not connect: Input/output error',
        });
      await service.inquireClassicRssi(0, '');
      await service.inquireClassicRssi(0, '');

      expect(service.successiveErrorsOccurred).toBe(1);
    });

    it('should not add to the occurred error count if the scan was stopped due to low time limits', async () => {
      mockExec
        .mockRejectedValueOnce({
          message: 'killed',
          signal: 'SIGKILL',
        })
        .mockResolvedValue({});
      await service.inquireClassicRssi(0, '');

      expect(service.successiveErrorsOccurred).toBe(0);
    });
  });

  describe('Bluetooth Low Energy', () => {
    const SERVICE_UUID = '5403c8a75c9647e99ab859e373d875a7';
    const CHARACTERISTIC_UUID = '21c46f33e813440786012ad281030052';

    it('should setup noble listeners on the first subscriber', () => {
      const callback = () => undefined;
      service.onLowEnergyDiscovery(callback);
      expect(mockNoble.on).toHaveBeenCalledWith(
        'stateChange',
        expect.any(Function)
      );
      expect(mockNoble.on).toHaveBeenCalledWith('discover', callback);
      expect(mockBleno.on).toHaveBeenCalledWith(
        'stateChange',
        expect.any(Function)
      );
    });

    it('should only setup noble listeners once', () => {
      service.onLowEnergyDiscovery(() => undefined);
      service.onLowEnergyDiscovery(() => undefined);
      expect(mockNoble.on).toHaveBeenCalledTimes(10);
      expect(mockBleno.on).toHaveBeenCalledTimes(3);
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

    it('should continue scanning and advertising if Classic inquiries are performed on another adapter', async () => {
      service.onLowEnergyDiscovery(() => undefined);
      const stateChangeHandler = mockNoble.on.mock.calls[0][1];
      stateChangeHandler('poweredOn');

      const execPromise = Promise.resolve({ stdout: '-1' });
      mockExec.mockReturnValue(execPromise);
      await service.inquireClassicRssi(1, 'x');

      expect(mockNoble.startScanning).toHaveBeenCalledTimes(1);
      expect(mockNoble.stopScanning).not.toHaveBeenCalled();
      expect(mockBleno.stopAdvertising).not.toHaveBeenCalled();
    });

    it('should throw an exception if trying to connect to a non-connectable peripheral', async () => {
      const peripheral = {
        connectable: false,
      } as Peripheral;

      await expect(async () => {
        await service.connectLowEnergyDevice(peripheral);
      }).rejects.toThrow();
    });

    it('should throw an exception if trying to connect to an already connecting peripheral', async () => {
      const peripheral = {
        connectable: true,
        state: 'connecting',
      } as Peripheral;

      await expect(async () => {
        await service.connectLowEnergyDevice(peripheral);
      }).rejects.toThrow();
    });

    it('should re-use connections for already connected peripherals', async () => {
      const peripheral = {
        connectable: true,
        state: 'connected',
      } as Peripheral;

      const result = await service.connectLowEnergyDevice(peripheral);

      expect(result).toBe(peripheral);
    });

    it('should only allow a single connection on an adapter', async () => {
      let connectResolve;
      const connectPromise = new Promise((r) => (connectResolve = r));

      jest.useRealTimers();

      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockReturnValue(connectPromise),
        disconnect: jest.fn(),
        removeAllListeners: jest.fn(),
        once: jest.fn(),
        state: 'disconnected',
      };

      service.connectLowEnergyDevice(peripheral as unknown as Peripheral);

      await expect(
        service.connectLowEnergyDevice(peripheral as unknown as Peripheral)
      ).rejects.toThrow();

      peripheral.state = 'connected';
      connectResolve();
    });

    it('should unlock the adapter on disconnect', async () => {
      jest.spyOn(Promises, 'sleep').mockResolvedValue();
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        once: jest.fn(),
        state: 'disconnected',
      };

      await service.connectLowEnergyDevice(peripheral as unknown as Peripheral);

      const disconnectListener = peripheral.once.mock.calls[0][1];
      disconnectListener();

      await expect(async () => {
        await service.connectLowEnergyDevice(
          peripheral as unknown as Peripheral
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
          peripheral as unknown as Peripheral
        );
      }).rejects.toThrow();

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
        .connectLowEnergyDevice(peripheral as unknown as Peripheral)
        .catch((e) => {
          expect(e).toStrictEqual(new Error('timed out'));
        });
      jest.advanceTimersByTime(10.5 * 1000);

      return promise;
    });

    it('should return the peripheral after connecting', async () => {
      jest.spyOn(Promises, 'sleep').mockResolvedValue();
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        once: jest.fn(),
        state: 'disconnected',
      };

      const actual = await service.connectLowEnergyDevice(
        peripheral as unknown as Peripheral
      );

      expect(actual).toBe(peripheral);
    });

    it('should retry connection attempts after immediate disconnects', async () => {
      const peripheral = {
        connectable: true,
        connectAsync: jest
          .fn()
          .mockResolvedValueOnce(undefined)
          .mockImplementation(() => {
            peripheral.state = 'connected';
            return Promise.resolve();
          }),
        once: jest.fn(),
        state: 'disconnected',
      };

      const actual = await service.connectLowEnergyDevice(
        peripheral as unknown as Peripheral
      );
      expect(actual).toBe(peripheral);
      expect(peripheral.connectAsync).toHaveBeenCalledTimes(2);
    });

    it('should throw after multiple connection attempts', async () => {
      jest.spyOn(Promises, 'sleep').mockResolvedValue();
      const peripheral = {
        connectable: true,
        connectAsync: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn(),
        once: jest.fn(),
        removeAllListeners: jest.fn(),
        state: 'disconnected',
      };

      await expect(async () => {
        await service.connectLowEnergyDevice(
          peripheral as unknown as Peripheral
        );
      }).rejects.toThrow();
      expect(peripheral.connectAsync).toHaveBeenCalledTimes(5);
    });

    it('should disconnect from a peripheral', async () => {
      const peripheral = {
        state: 'connected',
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
      };

      await service.disconnectLowEnergyDevice(
        peripheral as unknown as Peripheral
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
    });

    it('should reset the adapter if the disconnect fails', async () => {
      service.onLowEnergyDiscovery(() => undefined);

      const peripheral = {
        state: 'connected',
        disconnectAsync: jest.fn().mockRejectedValue({ message: '' }),
      };

      await service.disconnectLowEnergyDevice(
        peripheral as unknown as Peripheral
      );

      expect(mockExec).toHaveBeenCalledWith(
        'hciconfig hci0 reset',
        expect.anything()
      );
    });

    it('should not try to disconnect from a peripheral that is not connected', async () => {
      const peripheral = {
        state: 'disconnected',
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
      };

      await service.disconnectLowEnergyDevice(
        peripheral as unknown as Peripheral
      );

      expect(peripheral.disconnectAsync).not.toHaveBeenCalled();
    });

    it('should reset the adapter when query attempts time out', async () => {
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest
          .fn()
          .mockRejectedValue(new Error('timed out')),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;
      mockExec.mockReturnValue(new Promise((resolve) => setTimeout(resolve)));
      const resetSpy = jest.spyOn(service, 'resetHciDevice');

      await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should return the value of a query from the device', async () => {
      const gattCharacteristic = {
        readAsync: jest.fn().mockResolvedValue(Buffer.from('app-id', 'utf-8')),
      };
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockResolvedValue([gattCharacteristic]),
      };
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;

      const result = await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
      expect(result).toStrictEqual(Buffer.from('app-id', 'utf-8'));
    });

    it('should return null if device does not have the requested characteristic', async () => {
      const gattService = {
        discoverCharacteristicsAsync: jest.fn().mockResolvedValue([]),
      };
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;

      const result = await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if device does not have the requested service', async () => {
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest.fn().mockResolvedValue([]),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;

      const result = await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if there is an error while discovering GATT information', async () => {
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockRejectedValue(new Error('expected for this test')),
      };
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;

      const result = await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      expect(peripheral.disconnectAsync).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should not disconnect from an already disconnecting peripheral', async () => {
      const gattCharacteristic = {
        readAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'disconnecting';
          return Promise.resolve(Buffer.from('app-id', 'utf-8'));
        }),
      };
      const gattService = {
        discoverCharacteristicsAsync: jest
          .fn()
          .mockResolvedValue([gattCharacteristic]),
      };
      const peripheral = {
        id: 'abcd1234',
        connectable: true,
        connectAsync: jest.fn().mockImplementation(() => {
          peripheral.state = 'connected';
          return Promise.resolve();
        }),
        discoverServicesAsync: jest.fn().mockResolvedValue([gattService]),
        disconnectAsync: jest.fn().mockResolvedValue(undefined),
        once: jest.fn(),
      } as unknown as Peripheral;
      service.disconnectLowEnergyDevice = jest.fn();

      const result = await service.queryLowEnergyDevice(
        peripheral,
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      expect(service.disconnectLowEnergyDevice).not.toHaveBeenCalled();
      expect(result).toStrictEqual(Buffer.from('app-id', 'utf-8'));
    });

    it('should reset adapter if nothing has been detected for a while', async () => {
      jest.spyOn(Promises, 'sleep').mockResolvedValue();
      jest.useFakeTimers('modern');
      const execPromise = Promise.resolve({ stdout: '-1' });
      mockExec.mockReturnValue(execPromise);

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      service.onLowEnergyDiscovery(() => {});
      const stateCallback = mockNoble.on.mock.calls.find(
        (call) => call[0] === 'stateChange'
      )[1];
      const discoveryCallback = mockNoble.on.mock.calls.filter(
        (call) => call[0] === 'discover'
      )[1][1];
      await stateCallback('poweredOn');
      jest.resetAllMocks();

      discoveryCallback();
      jest.setSystemTime(Date.now() + 31 * 1000);

      await service.verifyLowEnergyScanner();

      expect(mockExec).toHaveBeenCalledWith(
        'hciconfig hci0 reset',
        expect.anything()
      );
    });

    it('should start advertising instance iBeacon after the scan started', () => {
      service.onLowEnergyDiscovery(() => undefined);
      const scanStartHandler = mockNoble.on.mock.calls[5][1];
      scanStartHandler();

      expect(mockBleno.startAdvertisingIBeacon).toHaveBeenCalledWith(
        'D1338ACE-002D-44AF-88D1-E57C12484966',
        1,
        expect.any(Number),
        -59
      );
    });

    it('should start advertising if bleno state goes into poweredOn and adapter is scanning', () => {
      Object.defineProperty(mockBleno, 'state', {
        value: 'poweredOff',
      });

      service.onLowEnergyDiscovery(() => undefined);
      const scanStartHandler = mockNoble.on.mock.calls[5][1];
      scanStartHandler();

      const blenoStateChangeHandler = mockBleno.on.mock.calls[0][1] as (
        state: any
      ) => void;
      Object.defineProperty(mockBleno, 'state', {
        value: 'poweredOn',
      });
      blenoStateChangeHandler('poweredOn');

      expect(mockBleno.startAdvertisingIBeacon).toHaveBeenCalledTimes(1);
    });

    it('should stop BLE operations on shutdown', () => {
      service.onLowEnergyDiscovery(() => undefined);
      service.onApplicationShutdown();

      expect(mockNoble.stopScanning).toHaveBeenCalledTimes(1);
      expect(mockBleno.stopAdvertising).toHaveBeenCalledTimes(1);
    });
  });
});
