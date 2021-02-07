import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Peripheral } from '@mkerix/noble';
import { EntitiesService } from '../../entities/entities.service';
import { IBeacon } from './i-beacon';
import { Tag } from './tag';
import { ConfigService } from '../../config/config.service';
import { BluetoothLowEnergyConfig } from './bluetooth-low-energy.config';
import { ClusterService } from '../../cluster/cluster.service';
import { NewDistanceEvent } from './new-distance.event';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { DeviceTrackerConfig } from '../home-assistant/device-tracker-config';
import { Device } from '../home-assistant/device';
import { RoomPresenceDistanceSensor } from '../room-presence/room-presence-distance.sensor';
import { SchedulerRegistry } from '@nestjs/schedule';
import { KalmanFilterable } from '../../util/filters';
import { makeId } from '../../util/id';
import { DISTRIBUTED_DEVICE_ID } from '../home-assistant/home-assistant.const';
import * as _ from 'lodash';
import { DeviceTracker } from '../../entities/device-tracker';
import { Sensor } from '../../entities/sensor';
import { RoomPresenceProxyHandler } from '../room-presence/room-presence.proxy';
import { BluetoothLowEnergyPresenceSensor } from './bluetooth-low-energy-presence.sensor';
import { BluetoothService } from '../bluetooth/bluetooth.service';
import { promiseWithTimeout } from '../../util/promises';
import * as util from 'util';

export const NEW_DISTANCE_CHANNEL = 'bluetooth-low-energy.new-distance';
const APPLE_ADVERTISEMENT_ID = Buffer.from([0x4c, 0x00]);

@Injectable() // parameters determined experimentally
export class BluetoothLowEnergyService
  extends KalmanFilterable(Object, 0.8, 15)
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothLowEnergyConfig;
  private readonly logger: Logger;
  private readonly seenIds = new Set<string>();
  private readonly companionAppTags = new Map<string, string>();
  private readonly companionAppDenylist = new Set<string>();
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
    if (!this.isAllowlistEnabled() && !this.isDenylistEnabled()) {
      this.logger.warn(
        'The allowlist and denylist are empty, no sensors will be created! Please add some of the discovered IDs below to your configuration.'
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
      (this.isOnAllowlist(tag.id) ||
        (!this.isAllowlistEnabled() && this.isDenylistEnabled())) &&
      !this.isOnDenylist(tag.id)
    ) {
      tag = this.applyOverrides(tag);
      tag.rssi = this.filterRssi(tag.id, tag.rssi);

      const globalSettings = this.configService.get('global');
      const event = new NewDistanceEvent(
        globalSettings.instanceName,
        tag.id,
        tag.name,
        tag.peripheral.id,
        tag.isApp,
        tag.rssi,
        tag.measuredPower,
        tag.distance,
        tag.distance > this.config.maxDistance,
        tag instanceof IBeacon ? tag.batteryLevel : undefined
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
    const disconnectPromise = util
      .promisify(tag.peripheral.once)
      .bind(tag.peripheral)('disconnect');

    const peripheral = await this.bluetoothService.connectLowEnergyDevice(
      tag.peripheral
    );

    try {
      return await promiseWithTimeout<string | null>(
        Promise.race([
          BluetoothLowEnergyService.readCompanionAppId(peripheral),
          disconnectPromise,
        ]),
        15 * 1000
      );
    } catch (e) {
      this.logger.error(
        `Failed to search for companion app at tag ${tag.id}: ${e.message}`,
        e.trace
      );

      if (e.message === 'timed out') {
        this.bluetoothService.resetHciDevice(
          this.bluetoothService.lowEnergyAdapterId
        );
      }

      return null;
    } finally {
      if (!['disconnecting', 'disconnected'].includes(tag.peripheral.state)) {
        this.bluetoothService.disconnectLowEnergyDevice(tag.peripheral);
      }
    }
  }

  /**
   * Passes newly found discovery information to aggregated room presence sensors.
   *
   * @param event - Event with new distance/battery data
   */
  handleNewDistance(event: NewDistanceEvent): void {
    const sensorId = makeId(`ble ${event.tagId}`);
    let sensor: BluetoothLowEnergyPresenceSensor;
    const hasBattery = event.batteryLevel !== undefined;

    if (event.isApp) {
      this.handleAppDiscovery(event.peripheralId, event.tagId);
    }

    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(
        sensorId
      ) as BluetoothLowEnergyPresenceSensor;
    } else {
      sensor = this.createRoomPresenceSensor(
        sensorId,
        event.tagId,
        event.tagName,
        hasBattery
      );
    }

    sensor.handleNewMeasurement(
      event.instanceName,
      event.rssi,
      event.measuredPower,
      event.distance,
      event.outOfRange,
      event.batteryLevel
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
   * Determines whether an allowlist has been configured or not.
   *
   * @returns Allowlist status
   */
  isAllowlistEnabled(): boolean {
    return (
      this.config.allowlist?.length > 0 || this.config.whitelist?.length > 0
    );
  }

  /**
   * Determines whether a denylist has been configured or not.
   *
   * @returns Denylist status
   */
  isDenylistEnabled(): boolean {
    return (
      this.config.denylist?.length > 0 || this.config.blacklist?.length > 0
    );
  }

  /**
   * Checks if an id is on the allowlist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the allowlist or not
   */
  isOnAllowlist(id: string): boolean {
    const allowlist = [
      ...(this.config.allowlist || []),
      ...(this.config.whitelist || []),
    ];
    if (allowlist.length === 0) {
      return false;
    }

    return this.config.allowlistRegex || this.config.whitelistRegex
      ? allowlist.some((regex) => id.match(regex))
      : allowlist.map((x) => x.toLowerCase()).includes(id.toLowerCase());
  }

  /**
   * Checks if an id is on the denylist of this component.
   *
   * @param id - Device id
   * @return Whether the id is on the denylist or not
   */
  isOnDenylist(id: string): boolean {
    const denylist = [
      ...(this.config.denylist || []),
      ...(this.config.blacklist || []),
    ];
    if (denylist.length === 0) {
      return false;
    }

    return this.config.denylistRegex || this.config.blacklistRegex
      ? denylist.some((regex) => id.match(regex))
      : denylist.map((x) => x.toLowerCase()).includes(id.toLowerCase());
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
   * Creates and registers a new room presence sensor and device tracker.
   *
   * @param sensorId - Id that the sensor should receive
   * @param deviceId - Id of the BLE peripheral
   * @param deviceName - Name of the BLE peripheral
   * @param hasBattery - Ability to report battery
   * @returns Registered room presence sensor
   */
  protected createRoomPresenceSensor(
    sensorId: string,
    deviceId: string,
    deviceName: string,
    hasBattery: boolean
  ): BluetoothLowEnergyPresenceSensor {
    const deviceInfo: Device = {
      identifiers: deviceId,
      name: deviceName,
      viaDevice: DISTRIBUTED_DEVICE_ID,
    };

    const deviceTracker = this.createDeviceTracker(
      makeId(`${sensorId}-tracker`),
      `${deviceName} Tracker`,
      deviceInfo
    );

    let batterySensor: Sensor;
    if (hasBattery) {
      batterySensor = this.createBatterySensor(
        makeId(`${sensorId}-battery`),
        `${deviceName} Battery`,
        deviceInfo
      );
    }

    const sensorName = `${deviceName} Room Presence`;
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:bluetooth',
          device: deviceInfo,
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
      new RoomPresenceProxyHandler(deviceTracker, batterySensor)
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
   * @param deviceInfo - Reference information about the BLE device
   * @returns Registered device tracker
   */
  protected createDeviceTracker(
    id: string,
    name: string,
    deviceInfo: Device
  ): DeviceTracker {
    const trackerCustomizations: Array<EntityCustomization<any>> = [
      {
        for: DeviceTrackerConfig,
        overrides: {
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
   * Creates and registers a new battery sensor.
   *
   * @param id - Entity ID for the new battery sensor
   * @param name - Name for the new battery sensor
   * @param deviceInfo - Reference information about the BLE device
   * @returns Registered battery sensor
   */
  protected createBatterySensor(
    id: string,
    name: string,
    deviceInfo: Device
  ): Sensor {
    const batteryCustomizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          deviceClass: 'battery',
          unitOfMeasurement: '%',
          device: deviceInfo,
        },
      },
    ];
    return this.entitiesService.add(
      new Sensor(id, name, true),
      batteryCustomizations
    ) as Sensor;
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
        this.config.minorMask,
        this.config.batteryMask
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
      if (overrides.batteryMask !== undefined && tag instanceof IBeacon) {
        tag.batteryMask = overrides.batteryMask;
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
    const manufacturerData = tag.peripheral?.advertisement?.manufacturerData;

    // only Apple devices are supported for the companion app
    // a more sophisticated detection could be possible by looking at the overflow area
    // more info: http://www.davidgyoungtech.com/2020/05/07/hacking-the-overflow-area
    // manufacturer data seems broken in noble though
    if (
      !this.companionAppTags.has(tag.id) &&
      !this.companionAppDenylist.has(tag.id) &&
      tag.peripheral.connectable &&
      BluetoothLowEnergyService.isAppleDevice(manufacturerData) &&
      BluetoothLowEnergyService.overflowContainsCompanionApp(
        BluetoothLowEnergyService.extractOverflowArea(manufacturerData)
      )
    ) {
      let appId: string;

      this.logger.log(`Attempting app discovery for tag ${tag.id}`);
      this.logger.debug(
        `Tag ${
          tag.id
        } seems to broadcast the app with manufacturer data ${tag.peripheral.advertisement.manufacturerData.toString(
          'hex'
        )}`
      );

      try {
        appId = await this.discoverCompanionAppId(tag);
      } catch (e) {
        this.logger.warn(
          `Failed to discover companion app ID due to error: ${e.message}`
        );
      }

      if (appId != null) {
        this.logger.log(
          `Discovered companion app with ID ${appId} for tag ${tag.id}`
        );
        this.handleAppDiscovery(tag.id, appId);
      } else {
        this.logger.debug(
          `Tag ${tag.id} should have the companion app, retrying in 15s`
        );
        this.banDeviceFromDiscovery(tag.id, 15 * 1000);
      }
    }

    const appId = this.companionAppTags.get(tag.id);
    if (appId != null) {
      tag.id = appId;
      tag.isApp = true;
    }

    return tag;
  }

  /**
   * Adds discovered app information to the local cache.
   * Does not override already existing values to null.
   *
   * @param tagId - ID of the actual peripheral (e.g. MAC)
   * @param appId - ID of the discovered app
   */
  protected handleAppDiscovery(tagId: string, appId: string): void {
    const oldId = this.companionAppTags.get(tagId);

    if (!(oldId != null && appId == null)) {
      this.companionAppTags.set(tagId, appId);
      this.companionAppDenylist.delete(tagId);
    }
  }

  /**
   * Temporarily bans a device from the app discovery process.
   *
   * @param tagId - ID of the tag that should be banned
   * @param duration - Time in milliseconds that the ban should be active for
   */
  private banDeviceFromDiscovery(tagId: string, duration: number) {
    this.companionAppDenylist.add(tagId);
    setTimeout(() => this.companionAppDenylist.delete(tagId), duration);
  }

  /**
   * Checks if an advertisements is from an Apple device.
   *
   * @param manufacturerData - Manufacturer Data sent within in BLE advertisement
   */
  private static isAppleDevice(manufacturerData: Buffer): boolean {
    return manufacturerData?.slice(0, 2).equals(APPLE_ADVERTISEMENT_ID);
  }

  /**
   * Extracts the overflow area from the manufacturer data if present.
   * If not present it will return null.
   * More info: http://www.davidgyoungtech.com/2020/05/07/hacking-the-overflow-area
   *
   * @param manufacturerData - Manufacturer Data sent within in BLE advertisement
   */
  private static extractOverflowArea(manufacturerData: Buffer): Buffer | null {
    if (
      manufacturerData == null ||
      manufacturerData.length < 19 ||
      manufacturerData.readUInt8(manufacturerData.length - 17) != 0x01
    ) {
      return null;
    }

    return manufacturerData.slice(manufacturerData.length - 16);
  }

  /**
   * Checks if the advertisement contains an overflow area.
   * Determined by the 4th bit of the 3rd byte.
   *
   * @param overflowArea - Overflow Area part of the Manufacturer Data
   */
  private static overflowContainsCompanionApp(overflowArea: Buffer): boolean {
    return overflowArea != null && ((overflowArea.readUInt8(3) >> 4) & 1) === 1;
  }

  /**
   * Reads a characteristic value of a BLE peripheral as string.
   *
   * @param peripheral - peripheral to read from
   * @param serviceUuid - UUID of the service that contains the characteristic
   * @param characteristicUuid - UUID of the characteristic to read
   */
  private static async readCharacteristic(
    peripheral: Peripheral,
    serviceUuid: string,
    characteristicUuid: string
  ): Promise<string | null> {
    const services = await peripheral.discoverServicesAsync([serviceUuid]);

    if (services.length > 0) {
      const characteristics = await services[0].discoverCharacteristicsAsync([
        characteristicUuid,
      ]);

      if (characteristics.length > 0) {
        const data = await characteristics[0].readAsync();
        return data.toString('utf-8');
      }
    }

    return null;
  }

  /**
   * Reads the companion app ID from the pre-defined characteristic.
   * May return null, which means no ID was found.
   *
   * @param peripheral - BLE peripheral to read from
   */
  private static readCompanionAppId(
    peripheral: Peripheral
  ): Promise<string | null> {
    return this.readCharacteristic(
      peripheral,
      '5403c8a75c9647e99ab859e373d875a7',
      '21c46f33e813440786012ad281030052'
    );
  }
}
