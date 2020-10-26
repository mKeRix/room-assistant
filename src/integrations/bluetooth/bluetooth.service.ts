import { Injectable, Logger } from '@nestjs/common';
import noble, { Peripheral } from '@abandonware/noble';
import util from 'util';
import { exec } from 'child_process';
import { BluetoothHealthIndicator } from './bluetooth.health';
import { BluetoothClassicConfig } from '../bluetooth-classic/bluetooth-classic.config';
import { ConfigService } from '../../config/config.service';
import { Device } from '../bluetooth-classic/device';

type BluetoothAdapterState = 'inquiry' | 'scan' | 'inactive';

const execPromise = util.promisify(exec);
const rssiRegex = new RegExp(/-?[0-9]+/);

@Injectable()
export class BluetoothService {
  private readonly logger: Logger = new Logger(BluetoothService.name);
  private readonly classicConfig: BluetoothClassicConfig;
  private readonly adapterStates = new Map<number, BluetoothAdapterState>();
  private lowEnergyAdapterId: number;

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
    await this.lockAdapter(adapterId);

    this.logger.debug(`Querying for RSSI of ${address} using hcitool`);
    try {
      const output = await execPromise(
        `hcitool -i hci${adapterId} cc "${address}" && hcitool -i hci${adapterId} rssi "${address}"`,
        {
          timeout: this.classicConfig.scanTimeLimit * 1000,
          killSignal: 'SIGKILL',
        }
      );
      const matches = output.stdout.match(rssiRegex);

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
      } else {
        this.logger.error(e.message);
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
    await this.lockAdapter(adapterId);

    try {
      const output = await execPromise(
        `hcitool -i hci${adapterId} info "${address}"`
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
   * Reset the hci (Bluetooth) device used for inquiries.
   */
  protected async resetHciDevice(adapterId: number): Promise<void> {
    try {
      await execPromise(`hciconfig hci${adapterId} reset`);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  /**
   * Locks an adapter for an active inquiry.
   *
   * @param adapterId - HCI Device ID of the adapter to lock
   */
  async lockAdapter(adapterId: number): Promise<void> {
    switch (this.adapterStates.get(adapterId)) {
      case 'inquiry':
        throw new Error(
          `Trying to lock adapter ${adapterId} even though it is already locked`
        );
      case 'scan':
        noble.stopScanning();
    }

    this.adapterStates.set(adapterId, 'inquiry');
  }

  /**
   * Unlocks an adapter and returns it to scan or inactive state.
   *
   * @param adapterId - HCI Device ID of the adapter to unlock
   */
  async unlockAdapter(adapterId: number): Promise<void> {
    this.adapterStates.set(adapterId, 'inactive');

    if (adapterId == this.lowEnergyAdapterId) {
      await this.handleAdapterStateChange(noble.state);
    }
  }

  /**
   * Sets up Noble hooks.
   */
  private setupNoble(): void {
    this.lowEnergyAdapterId = parseInt(process.env.NOBLE_HCI_DEVICE_ID) || 0;

    noble.on('stateChange', this.handleAdapterStateChange.bind(this));
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
    if (this.adapterStates.get(this.lowEnergyAdapterId) != 'inquiry') {
      if (state === 'poweredOn') {
        await noble.startScanningAsync([], true);
        this.adapterStates.set(this.lowEnergyAdapterId, 'scan');
      } else {
        await noble.stopScanning();
        this.adapterStates.set(this.lowEnergyAdapterId, 'inactive');
      }
    }
  }
}
