import { Test, TestingModule } from '@nestjs/testing';
import { GpioService } from './gpio.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { EntitiesService } from '../../entities/entities.service';
import { BinarySensor } from '../../entities/binary-sensor';
import { BinarySensorConfig } from '../home-assistant/binary-sensor-config';
import { Gpio } from 'onoff';
import { mocked } from 'ts-jest/utils';
import { ClusterService } from '../../cluster/cluster.service';

jest.mock('onoff');

describe('GpioService', () => {
  let service: GpioService;
  const entitiesService = {
    add: jest.fn()
  };
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };
  const mockGpio = mocked(Gpio);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, EntitiesModule],
      providers: [GpioService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue({})
      .compile();
    module.useLogger(loggerService);

    service = module.get<GpioService>(GpioService);
  });

  it('should register entities on bootstrap', () => {
    service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledTimes(2);
    expect(entitiesService.add).toHaveBeenCalledWith(
      new BinarySensor('gpio-pir-sensor', 'PIR Sensor'),
      expect.any(Array)
    );
    expect(entitiesService.add).toHaveBeenCalledWith(
      new BinarySensor('gpio-radar', 'Radar'),
      expect.any(Array)
    );
  });

  it('should pass on entity customizations', () => {
    service.onApplicationBootstrap();

    expect(entitiesService.add.mock.calls[1][1]).toContainEqual({
      for: BinarySensorConfig,
      overrides: {
        deviceClass: 'motion'
      }
    });
  });

  it('should export the binary sensors as input pins', () => {
    service.onApplicationBootstrap();

    expect(mockGpio).toHaveBeenCalledWith(23, 'in', 'both');
    expect(mockGpio).toHaveBeenCalledWith(24, 'in', 'both');
  });

  it('should watch input pins for interrupts', () => {
    service.onApplicationBootstrap();

    expect(mockGpio.mock.instances[0].watch).toHaveBeenCalled();
    expect(mockGpio.mock.instances[1].watch).toHaveBeenCalled();
  });

  it('should update binary sensor state using the watch callback', () => {
    const binarySensor = new BinarySensor('test', 'Test');
    entitiesService.add.mockReturnValue(binarySensor);
    service.onApplicationBootstrap();
    const callback = mocked(mockGpio.mock.instances[0].watch).mock.calls[0][0];

    callback(undefined, 1);
    expect(binarySensor.state).toBe(true);

    callback(undefined, 0);
    expect(binarySensor.state).toBe(false);
  });

  it('should log any errors that happened while watching for interrupts', () => {
    service.onApplicationBootstrap();
    const callback = mocked(mockGpio.mock.instances[0].watch).mock.calls[0][0];

    callback(new Error('Test Error'), undefined);
    expect(loggerService.error).toHaveBeenCalledWith(
      'Test Error',
      expect.any(String),
      GpioService.name
    );
  });

  it('should unexport pins on shutdown', () => {
    service.onApplicationBootstrap();
    service.onApplicationShutdown();

    expect(mockGpio.mock.instances[0].unexport).toHaveBeenCalled();
    expect(mockGpio.mock.instances[1].unexport).toHaveBeenCalled();
  });
});
