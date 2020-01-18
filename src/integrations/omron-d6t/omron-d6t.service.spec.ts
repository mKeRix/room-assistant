import { Test, TestingModule } from '@nestjs/testing';
import { OmronD6tService } from './omron-d6t.service';

describe('OmronD6tService', () => {
  let service: OmronD6tService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmronD6tService]
    }).compile();

    service = module.get<OmronD6tService>(OmronD6tService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
