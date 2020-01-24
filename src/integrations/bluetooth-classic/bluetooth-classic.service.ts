import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { BluetoothClassicConfig } from './bluetooth-classic.config';
import * as util from 'util';
import { exec } from 'child_process';
import { Node } from 'democracy';
import { NewRssiEvent } from './new-rssi.event';
import slugify from 'slugify';
import _ from 'lodash';
import { BluetoothClassicSensor } from './bluetooth-classic.sensor';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import {
  NEW_RSSI_CHANNEL,
  REQUEST_RSSI_CHANNEL
} from './bluetooth-classic.const';

@Injectable()
export class BluetoothClassicService
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothClassicConfig;
  private rotationOffset: number = 0;
  private logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.config = this.configService.get('bluetoothClassic');
    this.logger = new Logger(BluetoothClassicService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  async onModuleInit(): Promise<void> {
    const execPromise = util.promisify(exec);

    try {
      await execPromise('hcitool -h');
    } catch (e) {
      this.logger.error(
        'The Bluetooth Classic integration requires hcitool to be installed, which could not be found.'
      );
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.clusterService.on(
      REQUEST_RSSI_CHANNEL,
      this.handleRssiRequest.bind(this)
    );
    this.clusterService.on(NEW_RSSI_CHANNEL, this.handleNewRssi.bind(this));
    this.clusterService.subscribe(NEW_RSSI_CHANNEL);
  }

  /**
   * Takes a Bluetooth MAC address, determines the current RSSI and then publishes it across the cluster.
   *
   * @param address - Bluetooth MAC address
   */
  async handleRssiRequest(address: string): Promise<void> {
    const rssi = await this.inquireRssi(address);

    if (rssi !== undefined) {
      const event = new NewRssiEvent(
        this.configService.get('global').instanceName,
        address,
        rssi
      );

      this.clusterService.publish(NEW_RSSI_CHANNEL, event);
      this.handleNewRssi(event);
    }
  }

  /**
   * Processes an event with a new RSSI event by passing it along to the corresponding to sensor.
   * If no sensor matching the given address was found it will create a new one.
   *
   * @param event - Event that contains a new RSSI value
   */
  async handleNewRssi(event: NewRssiEvent): Promise<void> {
    const sensorId = slugify(
      _.lowerCase(`bluetooth-classic ${event.address} room presence`)
    );
    let sensor: BluetoothClassicSensor;
    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(sensorId) as BluetoothClassicSensor;
    } else {
      sensor = await this.createSensor(event.address, sensorId);
    }

    const timeout = this.calculateCurrentTimeout();
    sensor.handleNewRssi(event.instanceName, event.rssi, timeout);
  }

  /**
   * Sends out RSSI requests to the connected nodes in the cluster by matching each one with a MAC address.
   * Rotates the mapping on each call.
   */
  @Interval(10 * 1000)
  distributeInquiries(): void {
    if (this.clusterService.isLeader()) {
      const nodes = this.getParticipatingNodes();
      const addresses = Object.values(this.config.addresses);
      if (this.rotationOffset >= Math.max(nodes.length, addresses.length)) {
        this.rotationOffset = 0;
      }

      const [nodeSubset, addressSubset]: [Node[], string[]] = this.mapArrays(
        nodes,
        addresses,
        this.rotationOffset
      );
      nodeSubset.forEach((node, index) => {
        // only remote nodes have a timestamp of last contact attached
        if (node.last === undefined) {
          this.inquireRssi(addressSubset[index]);
        } else {
          this.clusterService.send(
            REQUEST_RSSI_CHANNEL,
            addressSubset[index],
            node.id
          );
        }
      });

      this.rotationOffset++;
    }
  }

  /**
   * Queries for the RSSI of a Bluetooth device using the hcitool shell command.
   *
   * @param address - Bluetooth MAC address
   * @returns RSSI value
   */
  async inquireRssi(address: string): Promise<number> {
    const execPromise = util.promisify(exec);

    const output = await execPromise(
      `hcitool cc "${address}" && hcitool rssi "${address}"`
    );
    const regex = new RegExp(/-?[0-9]+/);
    const matches = output.stdout.match(regex);

    return matches?.length > 0 ? parseInt(matches[0], 10) : undefined;
  }

  /**
   * Queries for the name of a Bluetooth device using the hcitool shell command.
   *
   * @param address - Bluetooth MAC address
   * @returns Bluetooth device name or undefined if not found
   */
  async inquireDeviceName(address: string): Promise<string> {
    const execPromise = util.promisify(exec);

    try {
      const output = await execPromise(`hcitool name "${address}"`);
      return output.stdout ? output.stdout : undefined;
    } catch (e) {
      this.logger.error(e.message);
      return undefined;
    }
  }

  /**
   * Filters the nodes in the cluster to those who have this integration loaded.
   *
   * @returns List of nodes with the Bluetooth Classic integration enabled
   */
  getParticipatingNodes(): Node[] {
    const nodes = Object.values(this.clusterService.nodes());
    return nodes.filter(node => node.channels?.includes(NEW_RSSI_CHANNEL));
  }

  /**
   * Creates and registers a new Bluetooth Classic sensor.
   *
   * @param sensorId - Entity ID for the new sensor
   * @param address - Bluetooth MAC address of the matching device
   * @returns Registered sensor
   */
  protected async createSensor(
    sensorId: string,
    address: string
  ): Promise<BluetoothClassicSensor> {
    const deviceName = (await this.inquireDeviceName(address)) || address;

    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:bluetooth'
        }
      }
    ];
    const sensor = this.entitiesService.add(
      new BluetoothClassicSensor(sensorId, `${deviceName} Room Presence`),
      customizations
    ) as BluetoothClassicSensor;

    const interval = setInterval(
      sensor.checkForTimeout.bind(sensor),
      10 * 1000
    );
    this.schedulerRegistry.addInterval(`${sensorId}_timeout_check`, interval);

    return sensor;
  }

  /**
   * Calculates the current timeout value based on the time it takes for a full rotation.
   *
   * @returns Timeout in seconds
   */
  protected calculateCurrentTimeout(): number {
    const nodes = this.getParticipatingNodes();
    const addresses = Object.values(this.config.addresses); // workaround for node-config deserializing to an Array-like object
    return Math.max(nodes.length, addresses.length) * 10;
  }

  /**
   * Maps the values of two arrays based on a numeric offset.
   *
   * @param a1 - The first array
   * @param a2 - The second array
   * @param offset - Index offset for the larger of both arrays
   * @returns A tuple with subsets of both input arrays with matching size
   */
  protected mapArrays(a1: any[], a2: any[], offset: number): [any[], any[]] {
    const [small, large] = a1.length > a2.length ? [a2, a1] : [a1, a2];
    const largeSubset = large.slice(offset, offset + small.length);
    if (offset + small.length > large.length) {
      largeSubset.push(
        ...large.slice(0, small.length - this.rotationOffset + 1)
      );
    }

    return a1.length > a2.length ? [largeSubset, a2] : [a1, largeSubset];
  }
}
