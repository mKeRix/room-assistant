import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { HealthIndicatorService } from './health-indicator.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(
    private health: HealthCheckService,
    private healthIndicatorService: HealthIndicatorService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check if this instance is healthy',
  })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check(this.healthIndicatorService.getIndicators());
  }
}
