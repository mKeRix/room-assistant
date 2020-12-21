import { Injectable, Logger } from '@nestjs/common';
import noble, { Peripheral } from '@mkerix/noble';
import util from 'util';
import { exec } from 'child_process';
import { BluetoothHealthIndicator } from './bluetooth.health';
import { BluetoothClassicConfig } from '../bluetooth-classic/bluetooth-classic.config';
import { ConfigService } from '../../config/config.service';
import { Device } from '../bluetooth-classic/device';
import { promiseWithTimeout, sleep } from '../../util/promises';
import { Interval } from '@nestjs/schedule';

const RSSI_REGEX = new RegExp(/-?[0-9]+/);
const INQUIRY_LOCK_TIMEOUT = 30 * 1000;
const SCAN_NO_PERIPHERAL_TIMEOUT = 30 * 1000;

const execPromise = util.promisify(exec);

type BluetoothAdapterState = 'inquiry' | 'scan' | 'inactive';
type ExecOutput = { stdout: string; stderr: string };

class BluetoothAdapter {
  state: BluetoothAdapterState;
  startedAt: Date;
}

class BluetoothAdapterMap extends Map<number, BluetoothAdapter> {
  getState(key: number): BluetoothAdapterState {
    return this.get(key)?.state;
  }

  setState(key: number, state: BluetoothAdapterState): this {
    return this.set(key, { state, startedAt: new Date() });
  }
}

@Injectable()
export class BluetoothService {
  private readonly logger: Logger = new Logger(BluetoothService.name);
  private readonly classicConfig: BluetoothClassicConfig;
  private readonly adapters = new BluetoothAdapterMap();
  private lowEnergyAdapterId: number;
  private lastLowEnergyDiscovery: Date;

  constructor(
    private readonly configService: ConfigService,
    private readonly healthIndicator: BluetoothHealthIndicator
  ) {
    this.classicConfig = this.configService.get('bluetoothClassic');
  }

  /**
   * Registers a callback function that will be invoked when a
   * Bluetooth Low Energy peripheral advertisement was received.
   *
   * @param callback - Callback function that receives a peripheral
   */
  onLowEnergyDiscovery(callback: (peripheral: Peripheral) => void): void {
    if (this.lowEnergyAdapterId == undefined) {
      this.setupNoble();
    }

    noble.on('discover', callback);
  }

  /**
   * Locks the adapter and establishes a connection the given BLE peripheral.
   * Connection attempts time out after 30s.
   *
   * @param peripheral - BLE peripheral to connect to
   */
  async connectLowEnergyDevice(peripheral: Peripheral): Promise<Peripheral> {
    if (!peripheral.connectable) {
      throw new Error('Trying to connect to a non-connectable device');
    }

    if (peripheral.state === 'connected') {
      return peripheral;
    } else if (peripheral.state === 'connecting') {
      throw new Error(
        `Connection to ${peripheral.address} is already trying to be established`
      );
    }

    this.logger.debug(
      `Connecting to BLE device at address ${peripheral.address}`
    );
    this.lockAdapter(this.lowEnergyAdapterId);

    peripheral.once('disconnect', (e) => {
      if (e) {
        this.logger.error(e);
      } else {
        this.logger.debug(
          `Disconnected from BLE device at address ${peripheral.address}`
        );
      }

      this.unlockAdapter(this.lowEnergyAdapterId);
    });

    try {
      await promiseWithTimeout(peripheral.connectAsync(), 10 * 1000);
      return peripheral;
    } catch (e) {
      this.logger.error(
        `Failed to connect to ${peripheral.address}: ${e.message}`,
        e.trace
      );
      peripheral.disconnect();
      peripheral.removeAllListeners();
      noble.reset();
      throw e;
    }
  }

  /**
   * Disconnect from the given BLE peripheral and unlock the adapter.
   *
   * @param peripheral - BLE peripheral to disconnect from
   */
  async disconnectLowEnergyDevice(peripheral: Peripheral): Promise<void> {
    if (!['connecting', 'connected'].includes(peripheral.state)) {
      return;
    }

    this.logger.debug(
      `Disconnecting from BLE device at address ${peripheral.address}`
    );
    try {
      await peripheral.disconnectAsync();
    } catch (e) {
      this.logger.error(
        `Failed to disconnect from ${peripheral.address}: ${e.message}`,
        e.trace
      );
      noble.reset();
    }
  }

  /**
   * Queries for the RSSI of a Bluetooth device using the hcitool shell command.
   *
   * @param adapterId - HCI Adapter ID to use for queries
   * @param address - Bluetooth MAC address
   * @returns RSSI value
   */
  async inquireClassicRssi(
    adapterId: number,
    address: string
  ): Promise<number> {
    this.lockAdapter(adapterId);

    this.logger.debug(`Querying for RSSI of ${address} using hcitool`);
    try {
      const output = await promiseWithTimeout<ExecOutput>(
        execPromise(
          `hcitool -i hci${adapterId} cc "${address}" && hcitool -i hci${adapterId} rssi "${address}"`,
          {
            timeout: this.classicConfig.scanTimeLimit * 1000,
            killSignal: 'SIGKILL',
          }
        ),
        this.classicConfig.scanTimeLimit * 1000 * 2
      );
      const matches = output.stdout.match(RSSI_REGEX);

      this.healthIndicator.reportSuccess();

      return matches?.length > 0 ? parseInt(matches[0], 10) : undefined;
    } catch (e) {
      if (e.signal === 'SIGKILL') {
        this.logger.debug(
          `Query of ${address} reached scan time limit, resetting hci${this.classicConfig.hciDeviceId}`
        );
        await this.resetHciDevice(adapterId);

        // when not reachable a scan runs for 6s, so lower time limits might not be an error
        if (this.classicConfig.scanTimeLimit >= 6) {
          this.healthIndicator.reportError();
        }
      } else if (
        e.message?.includes('Input/output') ||
        e.message?.includes('I/O')
      ) {
        this.logger.debug(e.message);
      } else if (e.message == 'timed out') {
        this.logger.warn(
          `Bluetooth adapter ${adapterId} seems stuck, resetting`
        );
        this.healthIndicator.reportError();
        await this.hardResetHciDevice(adapterId);
      } else {
        this.logger.error(`Inquiring RSSI via BT Classic failed: ${e.message}`);
        this.healthIndicator.reportError();
      }

      return undefined;
    } finally {
      this.unlockAdapter(adapterId);
    }
  }

  /**
   * Inquires device information of a Bluetooth peripheral.
   *
   * @param adapterId - HCI Adapter ID to use for queries
   * @param address - Bluetooth MAC address
   * @returns Device information
   */
  async inquireClassicDeviceInfo(
    adapterId: number,
    address: string
  ): Promise<Device> {
    this.lockAdapter(adapterId);

    try {
      const output = await promiseWithTimeout<ExecOutput>(
        execPromise(`hcitool -i hci${adapterId} info "${address}"`),
        6000
      );

      const nameMatches = /Device Name: (.+)/g.exec(output.stdout);
      const manufacturerMatches = /OUI Company: (.+) \(.+\)/g.exec(
        output.stdout
      );

      return {
        address,
        name: nameMatches ? nameMatches[1] : address,
        manufacturer: manufacturerMatches ? manufacturerMatches[1] : undefined,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        address,
        name: address,
      };
    } finally {
      this.unlockAdapter(adapterId);
    }
  }

  /**
   * Reset the hci (Bluetooth) device.
   */
  protected async resetHciDevice(adapterId: number): Promise<void> {
    try {
      await execPromise(`hciconfig hci${adapterId} reset`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  /**
   * Hard reset the hci (Bluetooth) device (down and up).
   */
  protected async hardResetHciDevice(adapterId: number): Promise<void> {
    try {
      await execPromise(`hciconfig hci${adapterId} down`);
      await sleep(1200);
      await execPromise(`hciconfig hci${adapterId} up`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  /**
   * Locks an adapter for an active inquiry.
   *
   * @param adapterId - HCI Device ID of the adapter to lock
   */
  lockAdapter(adapterId: number): void {
    this.logger.debug(`Locking adapter ${adapterId}`);

    switch (this.adapters.getState(adapterId)) {
      case 'inquiry':
        throw new Error(
          `Trying to lock adapter ${adapterId} even though it is already locked`
        );
      case 'scan':
        this.logger.debug(
          `Stop scanning for BLE peripherals on adapter ${this.lowEnergyAdapterId}`
        );
        noble.stopScanning();
    }

    this.adapters.setState(adapterId, 'inquiry');
  }

  /**
   * Unlocks an adapter and returns it to scan or inactive state.
   *
   * @param adapterId - HCI Device ID of the adapter to unlock
   */
  async unlockAdapter(adapterId: number): Promise<void> {
    if (this.adapters.getState(this.lowEnergyAdapterId) != 'inquiry') {
      return;
    }

    this.logger.debug(`Unlocking adapter ${adapterId}`);
    this.adapters.setState(adapterId, 'inactive');

    if (adapterId == this.lowEnergyAdapterId) {
      await this.handleAdapterStateChange(noble.state);
    }
  }

  /**
   * Checks if any adapters had a lock acquired on them for longer than
   * INQUIRY_LOCK_TIMEOUT and resets them before unlocking them again.
   */
  @Interval(10 * 1000)
  resetDeadlockedAdapters(): void {
    this.adapters.forEach(async (adapter, adapterId) => {
      if (
        adapter.state === 'inquiry' &&
        adapter.startedAt.getTime() < Date.now() - INQUIRY_LOCK_TIMEOUT
      ) {
        this.logger.log(
          `Detected unusually long lock on Bluetooth adapter ${adapterId}, resetting`
        );
        await this.resetHciDevice(adapterId);
        await this.unlockAdapter(adapterId);
      }
    });
  }

  /**
   * Restarts the scanning process if nothing has been detected for a while.
   */
  @Interval(5 * 1000)
  async verifyLowEnergyScanner(): Promise<void> {
    if (
      this.lowEnergyAdapterId != undefined &&
      ['scan', 'inactive'].includes(
        this.adapters.getState(this.lowEnergyAdapterId)
      ) &&
      this.lastLowEnergyDiscovery != undefined &&
      this.lastLowEnergyDiscovery.getTime() <
        Date.now() - SCAN_NO_PERIPHERAL_TIMEOUT
    ) {
      this.logger.warn(
        'Did not detect any low energy advertisements in a while, resetting'
      );
      await this.hardResetHciDevice(this.lowEnergyAdapterId);
    }
  }

  /**
   * Sets up Noble hooks.
   */
  private setupNoble(): void {
    this.lowEnergyAdapterId = parseInt(process.env.NOBLE_HCI_DEVICE_ID) || 0;
    this.adapters.setState(this.lowEnergyAdapterId, 'inactive');

    noble.on('stateChange', this.handleAdapterStateChange.bind(this));
    noble.on('discover', () => (this.lastLowEnergyDiscovery = new Date()));
    noble.on('warning', (message) => {
      if (message == 'unknown peripheral undefined RSSI update!') {
        return;
      }

      this.logger.warn(message);
    });
  }

  /**
   * Handles state adapter changes as reported by Noble.
   *
   * @param state - State of the HCI adapter
   */
  private async handleAdapterStateChange(state: string): Promise<void> {
    const adapterState = this.adapters.getState(this.lowEnergyAdapterId);
    if (state === 'poweredOn') {
      if (adapterState == 'inactive') {
        this.logger.debug(
          `Start scanning for BLE peripherals on adapter ${this.lowEnergyAdapterId}`
        );

        try {
          await promiseWithTimeout(noble.startScanningAsync([], true), 3000);
          this.adapters.setState(this.lowEnergyAdapterId, 'scan');
        } catch (e) {
          this.logger.error(`Failed to start scanning: ${e.message}`, e.stack);
          await this.hardResetHciDevice(this.lowEnergyAdapterId);
        }
      }
    } else if (adapterState === 'scan') {
      this.logger.debug(
        `Adapter ${this.lowEnergyAdapterId} went into state ${state}, cannot continue scanning`
      );
      this.adapters.setState(this.lowEnergyAdapterId, 'inactive');
    }
  }
}
