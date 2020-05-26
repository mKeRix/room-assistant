import { HealthIndicatorFunction } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthIndicatorService {
  private healthIndicators: HealthIndicatorFunction[] = [];

  getIndicators(): HealthIndicatorFunction[] {
    return this.healthIndicators;
  }

  registerHealthIndicator(
    healthIndicatorFunction: HealthIndicatorFunction
  ): void {
    this.healthIndicators.push(healthIndicatorFunction);
  }
}
