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
import _ from 'lodash';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import {
  NEW_RSSI_CHANNEL,
  REQUEST_RSSI_CHANNEL
} from './bluetooth-classic.const';
import { RoomPresenceDistanceSensor } from '../room-presence/room-presence-distance.sensor';
import { KalmanFilterable } from '../../util/filters';
import { makeId } from '../../util/id';
import { Device } from './device';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';

@Injectable()
export class BluetoothClassicService extends KalmanFilterable(Object, 1.4, 1)
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothClassicConfig;
  private rotationOffset = 0;
  private logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly clusterService: ClusterService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    super();
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
    let rssi = await this.inquireRssi(address);

    if (rssi !== undefined) {
      rssi = _.round(this.filterRssi(address, rssi), 1);
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
    this.logger.debug(
      `Received RSSI of ${event.rssi} for ${event.address} from ${event.instanceName}`
    );

    const sensorId = makeId(`bluetooth-classic ${event.address}`);
    let sensor: RoomPresenceDistanceSensor;
    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(sensorId) as RoomPresenceDistanceSensor;
    } else {
      sensor = await this.createSensor(sensorId, event.address);
    }

    sensor.timeout = this.calculateCurrentTimeout();
    sensor.handleNewDistance(event.instanceName, event.rssi * -1);
  }

  /**
   * Sends out RSSI requests to the connected nodes in the cluster by matching each one with a MAC address.
   * Rotates the mapping on each call.
   */
  @Interval(6 * 1000)
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
          this.handleRssiRequest(addressSubset[index]);
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
    const regex = new RegExp(/-?[0-9]+/);

    this.logger.debug(`Querying for RSSI of ${address} using hcitool`);
    try {
      const output = await execPromise(
        `hcitool cc "${address}" && hcitool rssi "${address}"`
      );
      const matches = output.stdout.match(regex);

      return matches?.length > 0 ? parseInt(matches[0], 10) : undefined;
    } catch (e) {
      this.logger.debug(e.message);
      return undefined;
    }
  }

  /**
   * Applies the Kalman filter based on the historic values with the same address.
   *
   * @param address - Bluetooth MAC address
   * @param rssi - Signal strength measurement for the given address
   * @returns Smoothed signal strength value
   */
  filterRssi(address: string, rssi: number): number {
    return this.kalmanFilter(rssi, address);
  }

  /**
   * Inquires device information of a Bluetooth peripheral.
   *
   * @param address - Bluetooth MAC address
   * @returns Device information
   */
  async inquireDeviceInfo(address: string): Promise<Device> {
    const execPromise = util.promisify(exec);

    try {
      const output = await execPromise(`hcitool info "${address}"`);

      const nameMatches = /Device Name: (.+)/g.exec(output.stdout);
      const manufacturerMatches = /OUI Company: (.+) \(.+\)/g.exec(
        output.stdout
      );

      return {
        address,
        name: nameMatches[1],
        manufacturer: manufacturerMatches[1]
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        address,
        name: address
      };
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
   * Creates and registers a new room presence sensor.
   *
   * @param sensorId - Entity ID for the new sensor
   * @param address - Bluetooth MAC address of the matching device
   * @returns Registered sensor
   */
  protected async createSensor(
    sensorId: string,
    address: string
  ): Promise<RoomPresenceDistanceSensor> {
    const deviceInfo = await this.inquireDeviceInfo(address);

    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:bluetooth',
          device: {
            identifiers: deviceInfo.address,
            name: deviceInfo.name,
            manufacturer: deviceInfo.manufacturer,
            connections: [['mac', deviceInfo.address]],
            viaDevice: DISTRIBUTED_DEVICE_ID
          }
        }
      }
    ];
    const sensor = this.entitiesService.add(
      new RoomPresenceDistanceSensor(
        sensorId,
        `${deviceInfo.name} Room Presence`,
        0
      ),
      customizations
    ) as RoomPresenceDistanceSensor;

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
    return Math.max(nodes.length, addresses.length) * 2 * 10;
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
