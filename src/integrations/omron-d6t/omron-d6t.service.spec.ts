import { Test, TestingModule } from '@nestjs/testing';
import { OmronD6tService } from './omron-d6t.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { EntitiesService } from '../../entities/entities.service';
import { ClusterService } from '../../cluster/cluster.service';

jest.mock('i2c-bus', () => jest.fn(), { virtual: true });

describe('OmronD6tService', () => {
  let service: OmronD6tService;
  const entitiesService = jest.fn();
  const clusterService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule],
      providers: [OmronD6tService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<OmronD6tService>(OmronD6tService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
