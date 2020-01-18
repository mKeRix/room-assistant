import { Test, TestingModule } from '@nestjs/testing';
import { HomeAssistantService } from './home-assistant.service';

describe('HomeAssistantService', () => {
  let service: HomeAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeAssistantService]
    }).compile();

    service = module.get<HomeAssistantService>(HomeAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
