import { Test, TestingModule } from '@nestjs/testing';
import { HomeAssistantService } from './home-assistant.service';
import { ConfigModule } from '../../config/config.module';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';

describe('HomeAssistantService', () => {
  let service: HomeAssistantService;
  const emitter: EventEmitter = new EventEmitter();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(emitter), ConfigModule],
      providers: [HomeAssistantService]
    }).compile();

    service = module.get<HomeAssistantService>(HomeAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
