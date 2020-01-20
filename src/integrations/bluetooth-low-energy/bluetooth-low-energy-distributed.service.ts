import { Injectable } from '@nestjs/common';
import { NewDistanceEvent } from './new-distance.event';
import { ConfigService } from '../../config/config.service';
import { EntitiesService } from '../../entities/entities.service';
import { BluetoothLowEnergyConfig } from './bluetooth-low-energy.config';
import slugify from 'slugify';
import _ from 'lodash';
import { BluetoothLowEnergyDistributedSensor } from './bluetooth-low-energy-distributed.sensor';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Entity } from '../../entities/entity.entity';

@Injectable()
export class BluetoothLowEnergyDistributedService {
  private readonly config: BluetoothLowEnergyConfig;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.config = this.configService.get('bluetoothLowEnergy');
  }

  handleNewDistance(event: NewDistanceEvent): void {
    const sensorId = slugify(_.lowerCase(`ble ${event.tagId} room presence`));
    let sensor: Entity;
    if (this.entitiesService.has(sensorId)) {
      sensor = this.entitiesService.get(sensorId);
    } else {
      const sensorName = `${event.tagId} Room Presence`;
      sensor = this.entitiesService.add(
        new BluetoothLowEnergyDistributedSensor(
          sensorId,
          sensorName,
          this.config.timeout
        )
      );
      const interval = setInterval(
        (sensor as BluetoothLowEnergyDistributedSensor).checkForTimeout.bind(
          sensor
        ),
        this.config.timeout * 1000
      );
      this.schedulerRegistry.addInterval(`${sensorId}_timeout_check`, interval);
    }

    (sensor as BluetoothLowEnergyDistributedSensor).handleNewDistance(
      event.instanceName,
      event.distance
    );
  }
}
