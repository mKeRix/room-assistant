import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { HealthIndicatorService } from './health-indicator.service';

@Controller('status')
export class StatusController {
  constructor(
    private health: HealthCheckService,
    private healthIndicatorService: HealthIndicatorService
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check(this.healthIndicatorService.getIndicators());
  }
}
