import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
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
import { SchedulerRegistry } from '@nestjs/schedule';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { DeviceTrackerConfig } from '../home-assistant/device-tracker-config';
import {
  NEW_RSSI_CHANNEL,
  REQUEST_RSSI_CHANNEL,
} from './bluetooth-classic.const';
import { RoomPresenceDistanceSensor } from '../../integration-support/room-presence/room-presence-distance.sensor';
import { KalmanFilterable } from '../../util/filters';
import { makeId } from '../../util/id';
import { Device } from './device';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import { Device as DeviceInfo } from '../home-assistant/device';
import { Switch } from '../../entities/switch';
import { SwitchConfig } from '../home-assistant/switch-config';
import { DeviceTracker } from '../../entities/device-tracker';
import { RoomPresenceProxyHandler } from '../../integration-support/room-presence/room-presence.proxy';
import { BluetoothService } from '../../integration-support/bluetooth/bluetooth.service';

const execPromise = util.promisify(exec);

@Injectable()
export class BluetoothClassicService
  extends KalmanFilterable(Object, 0.01, 0.7)
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothClassicConfig;
  private rotationOffset = 0;
  private inquiriesSwitch: Switch;
  private deviceMap = new Map<string, Device>();
  private logger: Logger;

  constructor(
    private readonly bluetoothService: BluetoothService,
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
    try {
      await execPromise('hcitool -h');
    } catch (e) {
      throw new Error('Could not find the required hcitool command');
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.inquiriesSwitch = this.createInquiriesSwitch();

    this.clusterService.on(
      REQUEST_RSSI_CHANNEL,
      this.handleRssiRequest.bind(this)
    );
    this.clusterService.on(NEW_RSSI_CHANNEL, this.handleNewRssi.bind(this));
    this.clusterService.subscribe(NEW_RSSI_CHANNEL);

    const interval = setInterval(
      this.distributeInquiries.bind(this),
      this.config.interval * 1000
    );
    this.schedulerRegistry.addInterval(
      `bluetooth_classic_distribute_inquiries`,
      interval
    );
  }

  /**
   * Takes a Bluetooth MAC address, determines the current RSSI and then publishes it across the cluster.
   *
   * @param address - Bluetooth MAC address
   */
  async handleRssiRequest(address: string): Promise<void> {
    if (_.isEmpty(address)) {
      this.logger.error('RSSI update for empty address requested');
      return;
    }

    if (this.shouldInquire()) {
      let rssi;
      try {
        rssi = await this.bluetoothService.inquireClassicRssi(
          this.config.hciDeviceId,
          address
        );
      } catch (e) {
        this.logger.error(
          `Failed to retrieve RSSI for ${address}: ${e.message}`
        );
      }

      if (rssi !== undefined) {
        rssi = _.round(this.filterRssi(address, rssi), 1);

        let device: Device;
        if (this.deviceMap.has(address)) {
          device = this.deviceMap.get(address);
        } else {
          device = await this.bluetoothService.inquireClassicDeviceInfo(
            this.config.hciDeviceId,
            address
          );
          this.deviceMap.set(address, device);
        }

        let minRssi: number;
        if (_.isObject(this.config.minRssi)) {
          minRssi = _.defaultTo(
            this.config.minRssi[address],
            this.config.minRssi.default
          );
        } else if (_.isNumber(this.config.minRssi)) {
          minRssi = this.config.minRssi;
        }

        const event = new NewRssiEvent(
          this.configService.get('global').instanceName,
          device,
          rssi,
          rssi < minRssi
        );

        this.clusterService.publish(NEW_RSSI_CHANNEL, event);
        this.handleNewRssi(event);
      }
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
      `Received RSSI of ${event.rssi} for ${event.device.address} from ${event.instanceName}`
    );

    const baseId =
      this.config.entityOverrides[event.device.address]?.id ||
      event.device.address;
    const sensorId = makeId(`bluetooth-classic ${baseId}`);
    let sensor: RoomPresenceDistanceSensor;
    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(sensorId) as RoomPresenceDistanceSensor;
    } else {
      sensor = await this.createSensor(sensorId, event.device);
    }

    sensor.timeout = this.calculateCurrentTimeout();
    sensor.handleNewDistance(
      event.instanceName,
      event.rssi * -1,
      event.outOfRange
    );
  }

  /**
   * Sends out RSSI requests to the connected nodes in the cluster by matching each one with a MAC address.
   * Rotates the mapping on each call.
   */
  distributeInquiries(): void {
    if (this.clusterService.isMajorityLeader()) {
      const nodes = this.getParticipatingNodes();
      const addresses = [...this.config.addresses];
      if (this.rotationOffset >= Math.max(nodes.length, addresses.length)) {
        this.rotationOffset = 0;
      }

      const [nodeSubset, addressSubset]: [Node[], string[]] = this.mapArrays(
        nodes,
        addresses,
        this.rotationOffset
      );
      nodeSubset.forEach((node, index) => {
        if (addressSubset[index] == null) {
          this.logger.error(
            `Trying to request inquiry without MAC! Current index: ${this.rotationOffset}. Addresses in this round: ${addressSubset}. Addresses overall: ${addresses}.`
          );
        }

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
   * Updates the underlying room presence sensor state.
   * Called regularly.
   * May emit pseudo update events to keep state correct.
   *
   * @param sensor - Room presence sensor that should be update
   * @param device - Data of device corresponding to the sensor
   */
  updateSensorState(sensor: RoomPresenceDistanceSensor, device: Device): void {
    if (!this.shouldInquire() && this.config.preserveState) {
      const instanceName = this.configService.get('global').instanceName;
      const previousReading = sensor.distances[instanceName];

      if (
        previousReading &&
        Date.now() <
          previousReading.lastUpdatedAt.getTime() +
            this.calculateCurrentTimeout() * 1000
      ) {
        // emit pseudo update to keep local state alive
        const event = new NewRssiEvent(
          instanceName,
          device,
          previousReading.distance * -1, // "distance" needs to be converted back to the RSSI value
          previousReading.outOfRange
        );

        this.clusterService.publish(NEW_RSSI_CHANNEL, event);
        this.handleNewRssi(event);
      }
    } else {
      sensor.updateState();
    }
  }

  /**
   * Filters the nodes in the cluster to those who have this integration loaded.
   *
   * @returns List of nodes with the Bluetooth Classic integration enabled
   */
  getParticipatingNodes(): Node[] {
    const nodes = Object.values(this.clusterService.nodes());
    return nodes.filter(
      (node) =>
        node.state !== 'removed' && node.channels?.includes(NEW_RSSI_CHANNEL)
    );
  }

  /**
   * Checks whether this instance should send out Bluetooth Inquiries at the moment or not.
   *
   * @returns Bluetooth inquiries allowed?
   */
  shouldInquire(): boolean {
    return this.inquiriesSwitch?.state;
  }

  /**
   * Creates and registers a new switch as a setting for whether Bluetooth queries should be made from this device or not.
   *
   * @returns Registered query switch
   */
  protected createInquiriesSwitch(): Switch {
    const instanceName = this.configService.get('global').instanceName;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SwitchConfig,
        overrides: {
          icon: 'mdi:bluetooth-audio',
        },
      },
    ];
    const inquiriesSwitch = this.entitiesService.add(
      new Switch(
        'bluetooth-classic-inquiries-switch',
        `${instanceName} Bluetooth Inquiries`
      ),
      customizations
    ) as Switch;

    if (this.config.inquireFromStart) {
      inquiriesSwitch.turnOn();
    } else {
      inquiriesSwitch.turnOff();
    }

    return inquiriesSwitch;
  }

  /**
   * Creates and registers a new room presence sensor.
   *
   * @param sensorId - Entity ID for the new sensor
   * @param device - Device information of the peripheral
   * @returns Registered sensor
   */
  protected async createSensor(
    sensorId: string,
    device: Device
  ): Promise<RoomPresenceDistanceSensor> {
    const baseName =
      this.config.entityOverrides[device.address]?.name || device.name;
    const deviceInfo: DeviceInfo = {
      identifiers: device.address,
      name: baseName,
      manufacturer: device.manufacturer,
      connections: [['mac', device.address]],
      viaDevice: DISTRIBUTED_DEVICE_ID,
    };

    const deviceTracker = this.createDeviceTracker(
      makeId(`${sensorId}-tracker`),
      `${baseName} Tracker`,
      deviceInfo
    );

    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:bluetooth',
          device: deviceInfo,
        },
      },
    ];
    const rawSensor = new RoomPresenceDistanceSensor(
      sensorId,
      `${baseName} Room Presence`,
      0
    );
    const sensorProxy = new Proxy<RoomPresenceDistanceSensor>(
      rawSensor,
      new RoomPresenceProxyHandler(deviceTracker)
    );

    const sensor = this.entitiesService.add(
      sensorProxy,
      customizations
    ) as RoomPresenceDistanceSensor;

    const interval = setInterval(
      () => this.updateSensorState(sensor, device),
      this.config.interval * 1000
    );
    this.schedulerRegistry.addInterval(`${sensorId}_timeout_check`, interval);

    return sensor;
  }

  /**
   * Creates and registers a new device tracker.
   *
   * @param id - Entity ID for the new device tracker
   * @param name - Name for the new device tracker
   * @param deviceInfo - Reference information about the BT Classic device
   * @returns Registered device tracker
   */
  protected createDeviceTracker(
    id: string,
    name: string,
    deviceInfo: DeviceInfo
  ): DeviceTracker {
    const trackerCustomizations: Array<EntityCustomization<any>> = [
      {
        for: DeviceTrackerConfig,
        overrides: {
          sourceType: 'bluetooth',
          device: deviceInfo,
        },
      },
    ];
    return this.entitiesService.add(
      new DeviceTracker(id, name, true),
      trackerCustomizations
    ) as DeviceTracker;
  }

  /**
   * Calculates the current timeout value based on the time it takes for a full rotation.
   *
   * @returns Timeout in seconds
   */
  protected calculateCurrentTimeout(): number {
    const nodes = this.getParticipatingNodes();
    const addresses = this.config.addresses;
    return (
      Math.max(nodes.length, addresses.length) *
      this.config.timeoutCycles *
      this.config.interval
    );
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
      largeSubset.push(...large.slice(0, small.length - largeSubset.length));
    }

    return a1.length > a2.length ? [largeSubset, a2] : [a1, largeSubset];
  }
}
