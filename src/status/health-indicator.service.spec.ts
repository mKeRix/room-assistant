import { Test, TestingModule } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthIndicatorService } from './health-indicator.service';
import { mocked } from 'ts-jest/utils';
import * as notify from 'sd-notify';

const mockedNotify = mocked(notify);

describe('HealthIndicatorService', () => {
  let service: HealthIndicatorService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');

    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule, ScheduleModule.forRoot()],
      providers: [HealthIndicatorService],
    }).compile();

    service = module.get<HealthIndicatorService>(HealthIndicatorService);
  });

  it('should mark application as ready on bootstrap', () => {
    service.onApplicationBootstrap();

    expect(mockedNotify.ready).toHaveBeenCalled();
  });

  it('should mark application as stopping on shutdown', () => {
    service.onModuleDestroy();

    expect(mockedNotify.stopping).toHaveBeenCalled();
  });

  it('should send a watchdog heartbeat if an interval is configured and the application is healthy', async () => {
    mockedNotify.watchdogInterval.mockReturnValue(60 * 1000);

    service.onApplicationBootstrap();
    jest.advanceTimersByTime(30 * 1000);
    jest.useRealTimers();
    await new Promise(setImmediate); // flush promises

    expect(mockedNotify.watchdog).toHaveBeenCalled();
  });

  it('should not send a watchdog heartbeat if the application is unhealthy', async () => {
    mockedNotify.watchdogInterval.mockReturnValue(60 * 1000);
    jest
      .spyOn(service, 'check')
      .mockResolvedValue({ status: 'error', details: {} });

    service.onApplicationBootstrap();
    jest.advanceTimersByTime(30 * 1000);
    jest.useRealTimers();
    await new Promise(setImmediate); // flush promises

    expect(mockedNotify.watchdog).not.toHaveBeenCalled();
  });

  it('should not send a watchdog heartbeat if no interval is configured', async () => {
    mockedNotify.watchdogInterval.mockReturnValue(0);

    service.onApplicationBootstrap();
    jest.advanceTimersByTime(1000);
    jest.useRealTimers();
    await new Promise(setImmediate); // flush promises

    expect(mockedNotify.watchdog).not.toHaveBeenCalled();
  });
});
