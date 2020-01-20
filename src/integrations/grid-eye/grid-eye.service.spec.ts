import { Test, TestingModule } from '@nestjs/testing';
import { GridEyeService } from './grid-eye.service';

describe('GridEyeService', () => {
  let service: GridEyeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridEyeService]
    }).compile();

    service = module.get<GridEyeService>(GridEyeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
