import { Test, TestingModule } from '@nestjs/testing';
import { OmronD6tService } from './omron-d6t.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EntitiesService } from '../../entities/entities.service';

jest.mock('i2c-bus', () => jest.fn(), { virtual: true });

describe('OmronD6tService', () => {
  let service: OmronD6tService;
  const entitiesService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [OmronD6tService]
    })
      .overrideProvider(EntitiesService)
      .useValue(entitiesService)
      .compile();

    service = module.get<OmronD6tService>(OmronD6tService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
