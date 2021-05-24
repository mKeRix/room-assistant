const mockI2cBus = {
  i2cWrite: jest.fn(),
  i2cRead: jest.fn(),
  close: jest.fn(),
};

import { Test, TestingModule } from '@nestjs/testing';
import { GridEyeService } from './grid-eye.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { Sensor } from '../../entities/sensor';
import i2cBus from 'i2c-bus';
import * as math from 'mathjs';

jest.mock(
  'i2c-bus',
  () => {
    return {
      openPromisified: jest.fn().mockReturnValue(mockI2cBus),
    };
  },
  { virtual: true }
);

describe('GridEyeService', () => {
  let service: GridEyeService;
  const entitiesService = {
    add: jest.fn(),
  };
  const clusterService = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [GridEyeService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<GridEyeService>(GridEyeService);
  });

  it('should open the i2c bus on bootstrap', async () => {
    await service.onApplicationBootstrap();

    expect(i2cBus.openPromisified).toHaveBeenCalled();
  });

  it('should set the sensor to 1 FPS on bootstrap', async () => {
    const setSpy = jest.spyOn(service, 'setRegister');
    await service.onApplicationBootstrap();

    expect(setSpy).toHaveBeenCalledWith(0x02, 1);
  });

  it('should register a new sensor on bootstrap', async () => {
    await service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'grideye_occupancy_count',
        name: 'GridEYE Occupancy Count',
      }),
      expect.any(Array)
    );
  });

  it('should register a new camera on bootstrap if available', async () => {
    jest.spyOn(service, 'isHeatmapAvailable').mockReturnValue(true);

    await service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'grideye_heatmap',
        name: 'GridEYE Heatmap',
      })
    );
  });

  it('should not register a new camera on bootstrap if dependency is missing', async () => {
    jest.spyOn(service, 'isHeatmapAvailable').mockReturnValue(false);

    await service.onApplicationBootstrap();

    expect(entitiesService.add).not.toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'grideye_heatmap',
        name: 'GridEYE Heatmap',
      })
    );
  });

  it('should close the i2c bus on shutdown', async () => {
    await service.onApplicationBootstrap();
    await service.onApplicationShutdown();

    expect(mockI2cBus.close).toHaveBeenCalled();
  });

  it('should update its state based on the calculated coordinates', async () => {
    const mockSensor = new Sensor('grideye', 'Occupancy');
    entitiesService.add.mockImplementation((entity) => {
      if (entity instanceof Sensor) {
        return mockSensor;
      }
      return entity;
    });
    jest.spyOn(service, 'getCoordinates').mockResolvedValue([
      [1, 2],
      [8, 6],
    ]);

    await service.onApplicationBootstrap();
    await service.updateState();
    expect(mockSensor.state).toBe(2);
    expect(mockSensor.attributes).toStrictEqual({
      coordinates: [
        [1, 2],
        [8, 6],
      ],
    });
  });

  it('should update the camera entity with the generated heatmap', async () => {
    entitiesService.add.mockImplementation((entity) => entity);
    jest.spyOn(service, 'isHeatmapAvailable').mockReturnValue(true);
    jest.spyOn(service, 'getCoordinates').mockResolvedValue([
      [1, 2],
      [8, 6],
    ]);

    const imageData = Buffer.from('abc');
    jest.spyOn(service, 'generateHeatmap').mockResolvedValue(imageData);

    await service.onApplicationBootstrap();
    await service.updateState();
    expect(entitiesService.add.mock.calls[1][0].state).toBe(imageData);
  });

  it('should limit heatmap rendering to one at a time', async () => {
    entitiesService.add.mockImplementation((entity) => entity);
    jest.spyOn(service, 'isHeatmapAvailable').mockReturnValue(true);
    jest.spyOn(service, 'getCoordinates').mockResolvedValue([
      [1, 2],
      [8, 6],
    ]);

    const imageData1 = Buffer.from('abc');
    const imageData2 = Buffer.from('def');

    let heatmapResolve;
    const heatmapPromise = new Promise<Buffer>((r) => (heatmapResolve = r));
    const heatmapSpy = jest
      .spyOn(service, 'generateHeatmap')
      .mockReturnValueOnce(heatmapPromise)
      .mockResolvedValue(imageData2);

    await service.onApplicationBootstrap();
    service.updateState(); // long running call for imageData1
    await service.updateState(); // second call that should not trigger heatmap generation

    await heatmapResolve(imageData1);

    expect(entitiesService.add.mock.calls[1][0].state).toBe(imageData1);
    expect(heatmapSpy).toHaveBeenCalledTimes(1);
  });

  it('should get the temperatures of all 64 pixels', async () => {
    const temperatureSpy = jest
      .spyOn(service, 'getPixelTemperature')
      .mockResolvedValue(1);

    const temperatures = await service.getPixelTemperatures();
    expect(temperatureSpy).toHaveBeenCalledTimes(64);
    expect(temperatures).toStrictEqual(math.ones([8, 8]));
  });

  it('should get the temperature of a single pixel', async () => {
    const registerSpy = jest
      .spyOn(service, 'getRegister')
      .mockResolvedValue(82);

    const temperature = await service.getPixelTemperature(10);
    expect(registerSpy).toHaveBeenCalledWith(148, 2);
    expect(temperature).toBe(20.5);
  });

  it('should get data from a register with an I2C command', async () => {
    mockI2cBus.i2cRead.mockImplementation((address, length, buffer: Buffer) => {
      buffer.write('T');
    });

    await service.onApplicationBootstrap();
    const value = await service.getRegister(162, 2);
    expect(mockI2cBus.i2cWrite).toHaveBeenCalledWith(
      0x69,
      2,
      expect.any(Buffer)
    );
    expect(mockI2cBus.i2cRead).toHaveBeenCalledWith(
      0x69,
      2,
      expect.any(Buffer)
    );
    expect(value).toBe(84);
  });

  it('should set a register value with an I2C command', async () => {
    await service.onApplicationBootstrap();
    await service.setRegister(0x02, 1);

    expect(mockI2cBus.i2cWrite).toHaveBeenCalledWith(
      0x69,
      2,
      Buffer.from([0x02, 1])
    );
  });
});
