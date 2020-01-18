import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit
} from '@nestjs/common';
import noble, { Peripheral } from '@abandonware/noble';
import * as _ from 'lodash';
import slugify from 'slugify';
import { EntitiesService } from '../../entities/entities.service';
import { Sensor } from '../../entities/sensor.entity';
import { IBeacon } from './i-beacon.entity';
import { Tag } from './tag.entity';
import { ConfigService } from '../../config/config.service';
import { Entity } from '../../entities/entity.entity';
import { BluetoothLowEnergyConfig } from './bluetooth-low-energy.config';
import { ClusterService } from '../../cluster/cluster.service';
import { NewDistanceEvent } from './new-distance.event';
import { BluetoothLowEnergyDistributedService } from './bluetooth-low-energy-distributed.service';

const NEW_DISTANCE_CHANNEL = 'bluetooth-low-energy.new-distance';

@Injectable()
export class BluetoothLowEnergyService
  implements OnModuleInit, OnApplicationBootstrap {
  private readonly config: BluetoothLowEnergyConfig;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService,
    private readonly clusterService: ClusterService,
    private readonly distributedService: BluetoothLowEnergyDistributedService
  ) {
    this.config = this.configService.get('bluetoothLowEnergy');
  }

  onModuleInit(): any {
    noble.on('stateChange', BluetoothLowEnergyService.handleStateChange);
    noble.on('discover', this.handleDiscovery.bind(this));
  }

  onApplicationBootstrap(): any {
    this.clusterService.on(
      NEW_DISTANCE_CHANNEL,
      this.distributedService.handleNewDistance.bind(this.distributedService)
    );
    this.clusterService.subscribe(NEW_DISTANCE_CHANNEL);
  }

  protected handleDiscovery(peripheral: Peripheral): void {
    const globalSettings = this.configService.get('global');

    let tag;
    if (
      this.config.processIBeacon &&
      this.isIBeacon(peripheral.advertisement.manufacturerData)
    ) {
      tag = new IBeacon(
        peripheral,
        this.config.majorMask,
        this.config.minorMask
      );
    } else if (this.config.onlyIBeacon) {
      return;
    } else {
      tag = new Tag(peripheral);
    }

    if (this.isOnWhitelist(tag.id)) {
      if (this.config.tagOverrides.hasOwnProperty(tag.id)) {
        const overrides = this.config.tagOverrides[tag.id];
        if (overrides.measuredPower !== undefined) {
          tag.measuredPower = overrides.measuredPower;
        }
      }

      const sensorId = slugify(`ble ${_.lowerCase(tag.id)}`);
      let sensor: Entity;
      if (this.entitiesService.has(sensorId)) {
        sensor = this.entitiesService.get(sensorId);
      } else {
        const sensorName = `Distance ${
          globalSettings.instanceName
        } - ${peripheral.advertisement.localName || peripheral.id}`;
        sensor = this.entitiesService.add(new Sensor(sensorId, sensorName));
      }

      sensor.state = tag.distance;
      const event = new NewDistanceEvent(
        globalSettings.instanceName,
        tag.id,
        tag.distance
      );
      this.distributedService.handleNewDistance(event);
      this.clusterService.publish(NEW_DISTANCE_CHANNEL, event);
    }
  }

  protected isIBeacon(manufacturerData: Buffer): boolean {
    return (
      manufacturerData &&
      25 <= manufacturerData.length && // expected data length
      0x004c === manufacturerData.readUInt16LE(0) && // apple company identifier
      0x02 === manufacturerData.readUInt8(2) && // ibeacon type
      0x15 === manufacturerData.readUInt8(3)
    ); // expected ibeacon data length
  }

  protected isOnWhitelist(id: string): boolean {
    const whitelist = this.config.whitelist;
    if (whitelist === undefined || whitelist.length === 0) {
      return true;
    }

    return this.config.whitelistRegex
      ? whitelist.some(regex => id.match(regex))
      : whitelist.includes(id);
  }

  private static handleStateChange(state: string): void {
    if (state === 'poweredOn') {
      noble.startScanning([], true);
    } else {
      noble.stopScanning();
    }
  }
}
