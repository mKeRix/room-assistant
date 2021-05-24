import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { HealthIndicatorService } from './health-indicator.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private healthIndicatorService: HealthIndicatorService) {}

  @Get()
  @ApiOperation({
    summary: 'Check if this instance is healthy',
  })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthIndicatorService.check();
  }
}
