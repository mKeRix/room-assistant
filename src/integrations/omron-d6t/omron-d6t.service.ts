import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import { EntitiesService } from '../../entities/entities.service';
import { ConfigService } from '../../config/config.service';
import { OmronD6tConfig } from './omron-d6t.config';
import i2cBus, { PromisifiedBus } from 'i2c-bus';
import { Interval } from '@nestjs/schedule';
import * as math from 'mathjs';
import { Sensor } from '../../entities/sensor';
import { Entity } from '../../entities/entity';
import { I2CError } from './i2c.error';
import { SensorConfig } from '../home-assistant/sensor-config';
import { ThermopileOccupancyService } from '../thermopile/thermopile-occupancy.service';

const TEMPERATURE_COMMAND = 0x4c;

@Injectable()
export class OmronD6tService extends ThermopileOccupancyService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly config: OmronD6tConfig;
  private i2cBus: PromisifiedBus;
  private sensor: Entity;
  private readonly logger: Logger;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly configService: ConfigService
  ) {
    super();
    this.config = this.configService.get('omronD6t');
    this.logger = new Logger(OmronD6tService.name);
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  async onApplicationBootstrap(): Promise<void> {
    this.i2cBus = await i2cBus.openPromisified(this.config.busNumber);
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
  @Interval(250)
  async updateState(): Promise<void> {
    try {
      const coordinates = await this.getCoordinates(this.config.deltaThreshold);

      this.sensor.state = coordinates.length;
      this.sensor.attributes.coordinates = coordinates;
    } catch (e) {
      if (e instanceof I2CError) {
        this.logger.debug(`Error during I2C communication: ${e.message}`);
      } else {
        this.logger.error(
          `Retrieving the state from D6T sensor failed: ${e.message}`,
          e.stack
        );
      }
    }
  }

  /**
   * Gets the temperatures of all sensor pixels.
   *
   * @returns 4x4 matrix of temperatures
   */
  async getPixelTemperatures(): Promise<number[][]> {
    const commandBuffer = Buffer.alloc(1);
    const resultBuffer = Buffer.alloc(35);

    commandBuffer.writeUInt8(TEMPERATURE_COMMAND, 0);
    await this.i2cBus.i2cWrite(
      this.config.address,
      commandBuffer.length,
      commandBuffer
    );
    await this.i2cBus.i2cRead(
      this.config.address,
      resultBuffer.length,
      resultBuffer
    );

    if (!this.checkPEC(resultBuffer, 34)) {
      throw new I2CError('PEC check for the message failed');
    }

    const pixelTemperatures = [];
    for (let i = 2; i < resultBuffer.length - 1; i += 2) {
      const temperature =
        (256 * resultBuffer.readUInt8(i + 1) + resultBuffer.readUInt8(i)) / 10;
      pixelTemperatures.push(temperature);
    }

    return math.reshape(pixelTemperatures, [4, 4]) as number[][];
  }

  /**
   * Performs a packet error check on the message.
   *
   * @param buffer - Message to be checked
   * @param pecIndex - Index of the PEC value in the message
   * @returns Message is valid or not
   */
  checkPEC(buffer: Buffer, pecIndex: number): boolean {
    let crc = this.calculateCRC(0x15);
    for (let i = 0; i < pecIndex; i++) {
      crc = this.calculateCRC(buffer.readUInt8(i) ^ crc);
    }

    return crc === buffer.readUInt8(pecIndex);
  }

  /**
   * Calculates a cyclic redundancy check value.
   *
   * @param data - Number to calculate the value for
   * @returns Check value
   */
  calculateCRC(data: number): number {
    const crc = new Uint8Array([data]);
    for (let i = 0; i < 8; i++) {
      const temp = crc[0];
      crc[0] = crc[0] << 1;
      if (temp & 0x80) {
        crc[0] = crc[0] ^ 0x07;
      }
    }

    return crc[0];
  }

  /**
   * Creates and registers a new occupancy count sensor.
   *
   * @returns Registered sensor
   */
  protected createSensor(): Sensor {
    const customizations = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:account',
          unitOfMeasurement: 'person'
        }
      }
    ];
    return this.entitiesService.add(
      new Sensor('d6t_occupancy_count', 'D6T Occupancy Count'),
      customizations
    ) as Sensor;
  }
}
