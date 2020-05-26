import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicatorService } from '../../status/health-indicator.service';

@Injectable()
export class BluetoothClassicHealthIndicator extends HealthIndicator {
  private errorsOccurred = 0;

  constructor(@Optional() healthIndicatorService?: HealthIndicatorService) {
    super();
    healthIndicatorService?.registerHealthIndicator(async () =>
      this.successiveErrorCheck(3)
    );
  }

  successiveErrorCheck(threshold: number): HealthIndicatorResult {
    const isHealthy = this.errorsOccurred < threshold;
    const result = this.getStatus(`bt_successive_errors`, isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError(
      'BT Classic successive error check failed',
      result
    );
  }

  reportError(): void {
    this.errorsOccurred++;
  }

  reportSuccess(): void {
    this.errorsOccurred = 0;
  }
}
