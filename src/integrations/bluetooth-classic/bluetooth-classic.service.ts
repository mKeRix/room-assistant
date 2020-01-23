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

  onApplicationBootstrap(): void {
    this.clusterService.on(
      REQUEST_RSSI_CHANNEL,
      this.handleRssiRequest.bind(this)
    );
    this.clusterService.on(NEW_RSSI_CHANNEL, this.handleNewRssi.bind(this));
    this.clusterService.subscribe(NEW_RSSI_CHANNEL);
  }

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

  @Interval(10 * 1000)
  distributeInquiries(): void {
    if (this.clusterService.isLeader()) {
      const nodes = Object.values(this.clusterService.nodes());
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

  async inquireRssi(address: string): Promise<number> {
    const execPromise = util.promisify(exec);

    const output = await execPromise(
      `hcitool cc "${address}" && hcitool rssi "${address}"`
    );
    const regex = new RegExp(/-?[0-9]+/);
    const matches = output.stdout.match(regex);

    return matches?.length > 0 ? parseInt(matches[0], 10) : undefined;
  }

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

  protected calculateCurrentTimeout(): number {
    const nodes = Object.values(this.clusterService.nodes());
    const addresses = Object.values(this.config.addresses); // workaround for node-config deserializing to an Array-like object
    return Math.max(nodes.length, addresses.length) * 10;
  }

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
