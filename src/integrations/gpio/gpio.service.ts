import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import { Gpio } from 'onoff';
import { BinarySensor } from '../../entities/binary-sensor';
import { GpioConfig } from './gpio.config';
import { makeId } from '../../util/id';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import {
  BinarySensorConfig,
  BinarySensorDeviceClass
} from '../home-assistant/binary-sensor-config';

@Injectable()
export class GpioService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly config: GpioConfig;
  private readonly logger: Logger;
  private readonly gpios: Gpio[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService
  ) {
    this.config = this.configService.get('gpio');
    this.logger = new Logger(GpioService.name);
  }

  onApplicationBootstrap(): void {
    this.config.binarySensors.forEach(binarySensor => {
      this.createBinarySensor(
        binarySensor.name,
        binarySensor.pin,
        binarySensor.deviceClass
      );
    });
  }

  onApplicationShutdown(): void {
    this.gpios.forEach(gpio => {
      gpio.unexport();
    });
  }

  protected createBinarySensor(
    name: string,
    pin: number,
    deviceClass?: BinarySensorDeviceClass
  ): BinarySensor {
    const id = makeId(`gpio ${name}`);
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: BinarySensorConfig,
        overrides: {
          deviceClass: deviceClass
        }
      }
    ];
    const binarySensor = this.entitiesService.add(
      new BinarySensor(id, name),
      customizations
    ) as BinarySensor;

    this.logger.log(`Opening pin ${pin} as input`);
    const gpio = new Gpio(pin, 'in', 'both');
    this.gpios.push(gpio);
    gpio.watch((err, value) => {
      if (err) {
        this.logger.error(err.message, err.stack);
        return;
      }

      binarySensor.state = Boolean(value);
    });

    return binarySensor;
  }
}
