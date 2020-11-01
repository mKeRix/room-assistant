import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Peripheral } from '@abandonware/noble';
import { EntitiesService } from '../../entities/entities.service';
import { IBeacon } from './i-beacon';
import { Tag } from './tag';
import { ConfigService } from '../../config/config.service';
import { BluetoothLowEnergyConfig } from './bluetooth-low-energy.config';
import { ClusterService } from '../../cluster/cluster.service';
import { NewDistanceEvent } from './new-distance.event';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { RoomPresenceDistanceSensor } from '../room-presence/room-presence-distance.sensor';
import { SchedulerRegistry } from '@nestjs/schedule';
import { KalmanFilterable } from '../../util/filters';
import { makeId } from '../../util/id';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import * as _ from 'lodash';
import { DeviceTracker } from '../../entities/device-tracker';
import { RoomPresenceDeviceTrackerProxyHandler } from '../room-presence/room-presence-device-tracker.proxy';
import { BluetoothLowEnergyPresenceSensor } from './bluetooth-low-energy-presence.sensor';
import { BluetoothService } from '../bluetooth/bluetooth.service';

export const NEW_DISTANCE_CHANNEL = 'bluetooth-low-energy.new-distance';
const APPLE_ADVERTISEMENT_ID = Buffer.from([0x4c, 0x00, 0x10]);

@Injectable() // parameters determined experimentally
export class BluetoothLowEnergyService
  extends KalmanFilterable(Object, 0.8, 15)
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothLowEnergyConfig;
  private readonly logger: Logger;
  private readonly seenIds = new Set<string>();
  private readonly companionAppTags = new Map<string, string>();
  private readonly companionAppBlacklist = new Set<string>();
  private tagUpdaters: {
    [tagId: string]: (event: NewDistanceEvent) => void;
  } = {};

  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService,
    private readonly clusterService: ClusterService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    super();
    this.config = this.configService.get('bluetoothLowEnergy');
    this.logger = new Logger(BluetoothLowEnergyService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    if (!this.isWhitelistEnabled() && !this.isBlacklistEnabled()) {
      this.logger.warn(
        'The whitelist and blacklist are empty, no sensors will be created! Please add some of the discovered IDs below to your configuration.'
      );
    }
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.bluetoothService.onLowEnergyDiscovery(this.handleDiscovery.bind(this));
    this.clusterService.on(
      NEW_DISTANCE_CHANNEL,
      this.handleNewDistance.bind(this)
    );
    this.clusterService.subscribe(NEW_DISTANCE_CHANNEL);
  }

  /**
   * Filters found BLE peripherals and publishes new distance data to sensors, depending on configuration.
   *
   * @param peripheral - BLE peripheral
   */
  async handleDiscovery(peripheral: Peripheral): Promise<void> {
    let tag = this.createTag(peripheral);
    if (this.config.onlyIBeacon && !(tag instanceof IBeacon)) {
      return;
    }

    tag = await this.applyCompanionAppOverride(tag);

    if (!this.seenIds.has(tag.id)) {
      this.logger.log(
        `Discovered new BLE peripheral ${tag.name} with ID ${tag.id} and RSSI ${tag.rssi}`
      );
      this.seenIds.add(tag.id);
    }

    if (
      (this.isOnWhitelist(tag.id) ||
        (!this.isWhitelistEnabled() && this.isBlacklistEnabled())) &&
      !this.isOnBlacklist(tag.id)
    ) {
      tag = this.applyOverrides(tag);
      tag.rssi = this.filterRssi(tag.id, tag.rssi);

      const globalSettings = this.configService.get('global');
      const event = new NewDistanceEvent(
        globalSettings.instanceName,
        tag.id,
        tag.name,
        tag.rssi,
        tag.measuredPower,
        tag.distance,
        tag.distance > this.config.maxDistance
      );

      if (!this.tagUpdaters.hasOwnProperty(tag.id)) {
        this.tagUpdaters[tag.id] = _.throttle((event: NewDistanceEvent) => {
          this.handleNewDistance(event);
          this.clusterService.publish(NEW_DISTANCE_CHANNEL, event);
        }, this.config.updateFrequency * 1000);
      }

      this.tagUpdaters[tag.id](event);
    }
  }

  /**
   * Connects to the given peripheral and looks for the companion app.
   * If the corresponding service and characteristic are found it will
   * return the app ID value.
   *
   * @param tag - Peripheral to connect to
   */
  async discoverCompanionAppId(tag: Tag): Promise<string | null> {
    const peripheral = await this.bluetoothService.connectLowEnergyDevice(
      tag.peripheral
    );

    try {
      const services = await peripheral.discoverServicesAsync([
        '5403c8a75c9647e99ab859e373d875a7',
      ]);

      if (services.length > 0) {
        const characteristics = await services[0].discoverCharacteristicsAsync([
          '21c46f33e813440786012ad281030052',
        ]);

        if (characteristics.length > 0) {
          const data = await characteristics[0].readAsync();
          return data.toString('utf-8');
        }
      }

      return null;
    } catch (e) {
      this.logger.error(
        `Failed to search for companion app at tag ${tag.id}: ${e.message}`,
        e.trace
      );
      return null;
    } finally {
      this.bluetoothService.disconnectLowEnergyDevice(tag.peripheral);
    }
  }

  /**
   * Passes newly found distance information to aggregated room presence sensors.
   *
   * @param event - Event with new distance data
   */
  handleNewDistance(event: NewDistanceEvent): void {
    const sensorId = makeId(`ble ${event.tagId}`);
    let sensor: BluetoothLowEnergyPresenceSensor;
    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(
        sensorId
      ) as BluetoothLowEnergyPresenceSensor;
    } else {
      sensor = this.createRoomPresenceSensor(
        sensorId,
        event.tagId,
        event.tagName
      );
    }

    sensor.handleNewMeasurement(
      event.instanceName,
      event.rssi,
      event.measuredPower,
      event.distance,
      event.outOfRange
    );
  }

  /**
   * Determines if the manufacturer data of a BLE peripheral belongs to an iBeacon or not.
   *
   * @param manufacturerData - Buffer of BLE peripheral manufacturer data
   * @returns Whether the data belongs to an iBeacon or not
   */
  isIBeacon(manufacturerData: Buffer): boolean {
    return (
      manufacturerData &&
      25 <= manufacturerData.length && // expected data length
      0x004c === manufacturerData.readUInt16LE(0) && // apple company identifier
      0x02 === manufacturerData.readUInt8(2) && // ibeacon type
      0x15 === manufacturerData.readUInt8(3)
    ); // expected ibeacon data length
  }

  /**
   * Determines whether a whitelist has been configured or not.
   *
   * @returns Whitelist status
   */
  isWhitelistEnabled(): boolean {
    return this.config.whitelist?.length > 0;
  }

  /**
   * Determines whether a blacklist has been configured or not.
   *
   * @returns Blacklist status
   */
  isBlacklistEnabled(): boolean {
    return this.config.blacklist?.length > 0;
  }

  /**
   * Checks if an id is on the whitelist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the whitelist or not
   */
  isOnWhitelist(id: string): boolean {
    const whitelist = this.config.whitelist;
    if (whitelist === undefined || whitelist.length === 0) {
      return false;
    }

    return this.config.whitelistRegex
      ? whitelist.some((regex) => id.match(regex))
      : whitelist.includes(id);
  }

  /**
   * Checks if an id is on the blacklist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the blacklist or not
   */
  isOnBlacklist(id: string): boolean {
    const blacklist = this.config.blacklist;
    if (blacklist === undefined || blacklist.length === 0) {
      return false;
    }

    return this.config.blacklistRegex
      ? blacklist.some((regex) => id.match(regex))
      : blacklist.includes(id);
  }

  /**
   * Applies the Kalman filter based on the historic values with the same tag id.
   *
   * @param tagId - Tag id that matches the measured device
   * @param rssi - Measured signal strength
   * @returns Smoothed signal strength value
   */
  filterRssi(tagId: string, rssi: number): number {
    return this.kalmanFilter(rssi, tagId);
  }

  /**
   * Creates and registers a new room presence sensor.
   *
   * @param sensorId - Id that the sensor should receive
   * @param deviceId - Id of the BLE peripheral
   * @param deviceName - Name of the BLE peripheral
   * @returns Registered room presence sensor
   */
  protected createRoomPresenceSensor(
    sensorId: string,
    deviceId: string,
    deviceName: string
  ): BluetoothLowEnergyPresenceSensor {
    const deviceTracker = this.createDeviceTracker(
      makeId(`${sensorId}-tracker`),
      deviceName
    );

    const sensorName = `${deviceName} Room Presence`;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:bluetooth',
          device: {
            identifiers: deviceId,
            name: deviceName,
            viaDevice: DISTRIBUTED_DEVICE_ID,
          },
        },
      },
    ];
    const rawSensor = new BluetoothLowEnergyPresenceSensor(
      sensorId,
      sensorName,
      this.config.timeout
    );
    const proxiedSensor = new Proxy<RoomPresenceDistanceSensor>(
      rawSensor,
      new RoomPresenceDeviceTrackerProxyHandler(deviceTracker)
    );
    const sensor = this.entitiesService.add(
      proxiedSensor,
      customizations
    ) as BluetoothLowEnergyPresenceSensor;

    const interval = setInterval(
      sensor.updateState.bind(sensor),
      this.config.timeout * 1000
    );
    this.schedulerRegistry.addInterval(`${sensorId}_timeout_check`, interval);

    return sensor;
  }

  /**
   * Creates and registers a new device tracker.
   *
   * @param id - Entity ID for the new device tracker
   * @param name - Name for the new device tracker
   * @returns Registered device tracker
   */
  protected createDeviceTracker(id: string, name: string): DeviceTracker {
    return this.entitiesService.add(
      new DeviceTracker(id, name, true)
    ) as DeviceTracker;
  }

  /**
   * Creates a tag based on a given BLE peripheral.
   *
   * @param peripheral - Noble BLE peripheral
   * @returns Tag or IBeacon
   */
  protected createTag(peripheral: Peripheral): Tag {
    if (
      this.config.processIBeacon &&
      this.isIBeacon(peripheral.advertisement.manufacturerData)
    ) {
      return new IBeacon(
        peripheral,
        this.config.majorMask,
        this.config.minorMask
      );
    } else {
      return new Tag(peripheral);
    }
  }

  /**
   * Checks if overrides have been configured for a tag and then applies them.
   *
   * @param tag - Tag that should be overridden
   * @returns Same tag with potentially overridden data
   */
  protected applyOverrides(tag: Tag): Tag {
    if (this.config.tagOverrides.hasOwnProperty(tag.id)) {
      const overrides = this.config.tagOverrides[tag.id];
      if (overrides.name !== undefined) {
        tag.name = overrides.name;
      }
      if (overrides.measuredPower !== undefined) {
        tag.measuredPower = overrides.measuredPower;
      }
    }

    return tag;
  }

  /**
   * Overrides tag data with a companion app ID if found.
   * Only performs discovery process for relevant devices.
   *
   * @param tag - Tag that should be overridden
   */
  protected async applyCompanionAppOverride(tag: Tag): Promise<Tag> {
    // only Apple devices are supported for the companion app
    // a more sophisticated detection could be possible by looking at the overflow area
    // more info: http://www.davidgyoungtech.com/2020/05/07/hacking-the-overflow-area
    // manufacturer data seems broken in noble though
    if (
      tag.peripheral.connectable &&
      tag.peripheral?.advertisement?.manufacturerData
        ?.slice(0, 3)
        .equals(APPLE_ADVERTISEMENT_ID) &&
      tag.peripheral.advertisement.manufacturerData.length > 10
    ) {
      if (
        !this.companionAppTags.has(tag.id) &&
        !this.companionAppBlacklist.has(tag.id)
      ) {
        this.companionAppTags.set(tag.id, null);

        try {
          this.logger.log(`Attempting app discovery for tag ${tag.id}`);
          const appId = await this.discoverCompanionAppId(tag);
          this.companionAppTags.set(tag.id, appId);

          if (appId) {
            this.logger.log(
              `Discovered companion app with ID ${appId} for tag ${tag.id}`
            );
          }
        } catch (e) {
          if (e.message === 'timed out') {
            this.logger.debug(
              `Temporarily blacklisting ${tag.id} from app discovery due to timeout`
            );
            this.companionAppBlacklist.add(tag.id);
            setTimeout(
              () => this.companionAppBlacklist.delete(tag.id),
              3 * 60 * 1000
            );
          } else {
            this.logger.debug(
              `Unable to retrieve companion ID, retrying on next advertisement: ${e.message}`
            );
          }

          this.companionAppTags.delete(tag.id);
        }
      }

      const appId = this.companionAppTags.get(tag.id);
      if (appId != null) {
        tag.id = appId;
      }
    }

    return tag;
  }
}
