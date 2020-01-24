import { Test, TestingModule } from '@nestjs/testing';
import { GridEyeService } from './grid-eye.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';

jest.mock('i2c-bus', () => jest.fn(), { virtual: true });

describe('GridEyeService', () => {
  let service: GridEyeService;
  const entitiesService = jest.fn();
  const clusterService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [GridEyeService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<GridEyeService>(GridEyeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
