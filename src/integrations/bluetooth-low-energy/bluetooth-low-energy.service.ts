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

export const NEW_DISTANCE_CHANNEL = 'bluetooth-low-energy.new-distance';

@Injectable() // parameters determined experimentally
export class BluetoothLowEnergyService
  extends KalmanFilterable(Object, 0.8, 15)
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothLowEnergyConfig;
  private readonly logger: Logger;
  private readonly seenIds = new Set<string>();
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
  handleDiscovery(peripheral: Peripheral): void {
    let tag = this.createTag(peripheral);
    if (this.config.onlyIBeacon && !(tag instanceof IBeacon)) {
      return;
    }

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
   * Passes newly found discovery information to aggregated room presence sensors.
   *
   * @param event - Event with new distance/battery data
   */
  handleNewDistance(event: NewDistanceEvent): void {
    const sensorId = makeId(`ble ${event.tagId}`);
    let sensor: BluetoothLowEnergyPresenceSensor;
    const hasBattery = event.batteryLevel !== undefined;

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
}
