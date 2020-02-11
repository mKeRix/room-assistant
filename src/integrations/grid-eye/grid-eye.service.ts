import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import i2cBus, { PromisifiedBus } from 'i2c-bus';
import { Entity } from '../../entities/entity';
import { EntitiesService } from '../../entities/entities.service';
import { Sensor } from '../../entities/sensor';
import * as math from 'mathjs';
import { Interval } from '@nestjs/schedule';
import { ThermopileOccupancyService } from '../thermopile/thermopile-occupancy.service';
import { GridEyeConfig } from './grid-eye.config';
import { ConfigService } from '../../config/config.service';
import { SensorConfig } from '../home-assistant/sensor-config';
import { EntityCustomization } from '../../entities/entity-customization.interface';

const TEMPERATURE_REGISTER_START = 0x80;
const FRAMERATE_REGISTER = 0x02;

@Injectable()
export class GridEyeService extends ThermopileOccupancyService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly config: GridEyeConfig;
  private i2cBus: PromisifiedBus;
  private sensor: Entity;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService
  ) {
    super();
    this.config = this.configService.get('gridEye');
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.i2cBus = await i2cBus.openPromisified(this.config.busNumber);
    this.setRegister(FRAMERATE_REGISTER, 1); // set framerate to 1 FPS -> less noise

    this.sensor = this.createSensor();
  }

  /**
   * Lifecycle hook, called once the application is shutting down.
   */
  async onApplicationShutdown(): Promise<void> {
    return this.i2cBus.close();
  }

  /**
   * Updates the state of the sensor that this integration manages.
   */
  @Interval(1000)
  async updateState(): Promise<void> {
    const coordinates = await this.getCoordinates(this.config.deltaThreshold);

    this.sensor.state = coordinates.length;
    this.sensor.attributes.coordinates = coordinates;
  }

  /**
   * Gets the temperatures of all sensor pixels.
   *
   * @returns 8x8 matrix of temperatures
   */
  async getPixelTemperatures(): Promise<number[][]> {
    const temperatures = [];
    for (let i = 0; i < 64; i++) {
      temperatures.push(await this.getPixelTemperature(i));
    }

    return math.reshape(temperatures, [8, 8]) as number[][];
  }

  /**
   * Gets the temperature of a single sensor pixel.
   *
   * @param pixelAddr - Index of the pixel, between 0 and 63
   * @returns Temperature sensed by the pixel
   */
  async getPixelTemperature(pixelAddr: number): Promise<number> {
    const pixelLowRegister = TEMPERATURE_REGISTER_START + 2 * pixelAddr;
    let temperature = await this.getRegister(pixelLowRegister, 2);

    if (temperature & (1 << 11)) {
      temperature &= ~(1 << 11);
      temperature = temperature * -1;
    }

    return temperature * 0.25;
  }

  /**
   * Gets a value from a given register.
   *
   * @param register - Sensor register address
   * @param length - Length of the value to retrieve
   * @returns Register value
   */
  async getRegister(register: number, length: number): Promise<number> {
    const commandBuffer = Buffer.alloc(1);
    commandBuffer.writeUInt8(register, 0);
    const resultBuffer = Buffer.alloc(length);

    await this.i2cBus.i2cWrite(
      this.config.address,
      commandBuffer.length,
      commandBuffer
    );
    await this.i2cBus.i2cRead(this.config.address, length, resultBuffer);

    const lsb = resultBuffer.readUInt8(0);
    const msb = resultBuffer.readUInt8(1);

    return (msb << 8) | lsb;
  }

  /**
   * Sets a value in a given register.
   *
   * @param register - Sensor register address
   * @param value - Value to write
   */
  async setRegister(register: number, value: number): Promise<void> {
    const commandBuffer = Buffer.alloc(2);
    commandBuffer.writeUInt8(register, 0);
    commandBuffer.writeUInt8(value, 1);

    await this.i2cBus.i2cWrite(
      this.config.address,
      commandBuffer.length,
      commandBuffer
    );
  }

  /**
   * Creates and registers a new occupancy count sensor.
   *
   * @returns Registered sensor
   */
  private createSensor(): Sensor {
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:account',
          unitOfMeasurement: 'person'
        }
      }
    ];
    return this.entitiesService.add(
      new Sensor('grideye_occupancy_count', 'GridEYE Occupancy Count'),
      customizations
    ) as Sensor;
  }
}
