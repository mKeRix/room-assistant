import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthIndicatorService } from './health-indicator.service';
import { ScheduleModule } from '@nestjs/schedule';

describe('Status Controller', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule, ScheduleModule.forRoot()],
      controllers: [StatusController],
      providers: [HealthIndicatorService],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should return healthy', async () => {
    const status = await controller.check();
    expect(status.status).toEqual('ok');
  });
});
