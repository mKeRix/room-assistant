const mockI2cBus = {
  i2cWrite: jest.fn(),
  i2cRead: jest.fn(),
  close: jest.fn(),
};

import { Test, TestingModule } from '@nestjs/testing';
import { OmronD6tService } from './omron-d6t.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';
import { Sensor } from '../../entities/sensor';
import { I2CError } from './i2c.error';
import i2cBus from 'i2c-bus';

jest.mock(
  'i2c-bus',
  () => {
    return {
      openPromisified: jest.fn().mockReturnValue(mockI2cBus),
    };
  },
  { virtual: true }
);

const VALID_RESPONSE = Buffer.from([
  0xe5,
  0x00,
  0xc9,
  0x00,
  0xce,
  0x00,
  0xcb,
  0x00,
  0xc7,
  0x00,
  0xca,
  0x00,
  0xc8,
  0x00,
  0xc7,
  0x00,
  0xc6,
  0x00,
  0xcb,
  0x00,
  0xc8,
  0x00,
  0xc7,
  0x00,
  0xc5,
  0x00,
  0xc9,
  0x00,
  0xc8,
  0x00,
  0xc8,
  0x00,
  0xc5,
  0x00,
  0x24,
]);

describe('OmronD6tService', () => {
  let service: OmronD6tService;
  const entitiesService = {
    add: jest.fn(),
  };
  const clusterService = jest.fn();
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule],
      providers: [OmronD6tService],
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();
    module.useLogger(loggerService);

    service = module.get<OmronD6tService>(OmronD6tService);
  });

  it('should open the i2c bus on bootstrap', async () => {
    await service.onApplicationBootstrap();

    expect(i2cBus.openPromisified).toHaveBeenCalled();
  });

  it('should register a new sensor on bootstrap', async () => {
    await service.onApplicationBootstrap();

    expect(entitiesService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'd6t_occupancy_count',
        name: 'D6T Occupancy Count',
      }),
      expect.any(Array)
    );
  });

  it('should close the i2c bus on shutdown', async () => {
    await service.onApplicationBootstrap();
    await service.onApplicationShutdown();

    expect(mockI2cBus.close).toHaveBeenCalled();
  });

  it('should update its state based on the calculated coordinates', async () => {
    const mockSensor = new Sensor('d6t', 'Occupancy');
    entitiesService.add.mockReturnValue(mockSensor);
    jest.spyOn(service, 'getCoordinates').mockResolvedValue([
      [1, 0],
      [2, 3],
    ]);

    await service.onApplicationBootstrap();
    await service.updateState();
    expect(mockSensor.state).toBe(2);
    expect(mockSensor.attributes).toStrictEqual({
      coordinates: [
        [1, 0],
        [2, 3],
      ],
    });
  });

  it('should log PEC check errors to debug', async () => {
    jest
      .spyOn(service, 'getCoordinates')
      .mockRejectedValue(new I2CError('PEC check failed'));

    await service.onApplicationBootstrap();
    await service.updateState();
    expect(loggerService.debug).toHaveBeenCalledWith(
      expect.stringContaining('PEC check failed'),
      OmronD6tService.name,
      false
    );
  });

  it('should log other errors in the error level', async () => {
    jest
      .spyOn(service, 'getCoordinates')
      .mockRejectedValue(new Error('bus unavailable'));

    await service.onApplicationBootstrap();
    await service.updateState();
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('bus unavailable'),
      expect.any(String),
      OmronD6tService.name
    );
  });

  it('should convert a valid I2C response to a temperature matrix', async () => {
    mockI2cBus.i2cRead.mockImplementation((address, length, buffer: Buffer) => {
      VALID_RESPONSE.copy(buffer);
    });

    await service.onApplicationBootstrap();
    const temperatures = await service.getPixelTemperatures();
    expect(mockI2cBus.i2cWrite).toHaveBeenCalledWith(
      0x0a,
      1,
      expect.any(Buffer)
    );
    expect(mockI2cBus.i2cRead).toHaveBeenCalledWith(
      0x0a,
      35,
      expect.any(Buffer)
    );
    expect(temperatures).toStrictEqual([
      [20.1, 20.6, 20.3, 19.9],
      [20.2, 20.0, 19.9, 19.8],
      [20.3, 20.0, 19.9, 19.7],
      [20.1, 20.0, 20.0, 19.7],
    ]);
  });

  it('should throw an exception if the received data is faulty', async () => {
    mockI2cBus.i2cRead.mockImplementation((address, length, buffer: Buffer) => {
      VALID_RESPONSE.copy(buffer);
      buffer.writeUInt8(12, 2);
    });

    await service.onApplicationBootstrap();
    await expect(service.getPixelTemperatures()).rejects.toStrictEqual(
      new I2CError('PEC check for the message failed')
    );
  });
});
