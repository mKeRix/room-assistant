import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EntitiesService } from '../../entities/entities.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as util from 'util';
import { exec } from 'child_process';
import { ShellConfig } from './shell.config';
import { makeId } from '../../util/id';
import { Sensor } from '../../entities/sensor';
import { EntityCustomization } from '../../entities/entity-customization.interface';
import { SensorConfig } from '../home-assistant/sensor-config';
import { CronJob } from 'cron';

@Injectable()
export class ShellService implements OnApplicationBootstrap {
  private readonly config: ShellConfig;
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly entitiesService: EntitiesService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.config = this.configService.get('shell');
    this.logger = new Logger(ShellService.name);
  }

  onApplicationBootstrap(): void {
    this.config.sensors.forEach(sensorOptions => {
      const sensor = this.createSensor(
        sensorOptions.name,
        sensorOptions.deviceClass,
        sensorOptions.unitOfMeasurement,
        sensorOptions.icon
      );
      const regex = sensorOptions.regex
        ? new RegExp(sensorOptions.regex)
        : undefined;
      const job = new CronJob(sensorOptions.cron, async () => {
        sensor.state = await this.executeCommand(sensorOptions.command, regex);
      });

      this.schedulerRegistry.addCronJob(
        makeId(`shell ${sensorOptions.name}`),
        job
      );
      job.start();
    });
  }

  async executeCommand(command: string, regex?: RegExp): Promise<string> {
    const execPromise = util.promisify(exec);
    const output = await execPromise(command);
    this.logger.debug(
      `${command} returned stdout:\n${output.stdout}\nstderr:\n${output.stderr}`
    );

    if (regex) {
      const results = regex.exec(output.stdout);
      return results ? results[1] || results[0] : undefined;
    } else {
      return output.stdout.trim();
    }
  }

  protected createSensor(
    name: string,
    deviceClass?: string,
    unitOfMeasurement?: string,
    icon?: string
  ): Sensor {
    const id = makeId(`shell ${name}`);
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          deviceClass,
          unitOfMeasurement,
          icon
        }
      }
    ];
    return this.entitiesService.add(
      new Sensor(id, name),
      customizations
    ) as Sensor;
  }
}
