import { Test, TestingModule } from '@nestjs/testing';
import { ShellService } from './shell.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { Sensor } from '../../entities/sensor';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { SensorConfig } from '../home-assistant/sensor-config';
import { CronJob } from 'cron';
import * as util from 'util';
import { ShellSwitch } from './shell.switch';

jest.mock('mdns', () => ({}), { virtual: true });
jest.mock('cron');
jest.mock('util', () => ({
  ...jest.requireActual('util'),
  promisify: jest.fn(),
}));

describe('ShellService', () => {
  let service: ShellService;
  const entitiesService = {
    add: jest.fn(),
  };
  const schedulerRegistry = {
    addCronJob: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, EntitiesModule, ScheduleModule.forRoot()],
      providers: [ShellService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue({})
      .overrideProvider(SchedulerRegistry)
      .useValue(schedulerRegistry)
      .compile();

    service = module.get<ShellService>(ShellService);
  });

  it('should register entities on bootstrap', () => {
    service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledTimes(3);
    expect(entitiesService.add).toHaveBeenCalledWith(
      new Sensor('shell-simple-test', 'Simple Test'),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new Sensor('shell-regex-test', 'Regex Test'),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new ShellSwitch(
        'shell-test-switch',
        'Test Switch',
        'echo on',
        'echo off'
      ),
      expect.any(Array)
    );
  });

  it('should pass on entity customizations', () => {
    service.onApplicationBootstrap();

    expect(entitiesService.add.mock.calls[1][1]).toContainEqual({
      for: SensorConfig,
      overrides: {
        deviceClass: 'timestamp',
        icon: 'mdi:test',
        unitOfMeasurement: 'tests',
      },
    });
  });

  it('should register cronjobs for the configured commands', () => {
    service.onApplicationBootstrap();

    expect(CronJob).toHaveBeenCalledTimes(2);
    expect(CronJob).toHaveBeenCalledWith('* * * * *', expect.any(Function));
    expect(CronJob).toHaveBeenCalledWith('* * * * */2', expect.any(Function));

    expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(2);
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
      'shell-simple-test',
      expect.any(CronJob)
    );
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
      'shell-regex-test',
      expect.any(CronJob)
    );
  });

  it('should start cronjobs once they are registered', () => {
    service.onApplicationBootstrap();
    expect(CronJob.mock.instances[0].start).toHaveBeenCalled();
  });

  it('should set the sensor state using the configured command', async () => {
    const sensor = new Sensor('test-sensor', 'Test');
    entitiesService.add.mockReturnValue(sensor);
    jest.spyOn(service, 'executeCommand').mockResolvedValue('42');

    service.onApplicationBootstrap();
    await CronJob.mock.calls[0][1]();

    expect(sensor.state).toBe('42');
  });

  it('should return trimmed output for commands without regex', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: '1234\n' });
    });

    expect(await service.executeCommand('echo 1234')).toBe('1234');
  });

  it('should return matched string if regex was provided', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: 'test 1234\n' });
    });

    expect(await service.executeCommand('echo "test 1234"', /[0-9]+/g)).toBe(
      '1234'
    );
  });

  it('should return first capture group if available', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: 'test 1234\n' });
    });

    expect(
      await service.executeCommand('echo "test 1234"', /test ([0-9]+)/g)
    ).toBe('1234');
  });

  it('should return undefined if no match was found', async () => {
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return jest.fn().mockResolvedValue({ stdout: 'test 1234\n' });
    });

    expect(
      await service.executeCommand('echo "test 1234"', /([0-9]+) test/g)
    ).toBeUndefined();
  });
});
