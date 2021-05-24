import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicatorService } from '../../status/health-indicator.service';
import { BluetoothService } from './bluetooth.service';

@Injectable()
export class BluetoothHealthIndicator extends HealthIndicator {
  constructor(
    private bluetoothService: BluetoothService,
    @Optional() healthIndicatorService?: HealthIndicatorService
  ) {
    super();
    healthIndicatorService?.registerHealthIndicator(async () =>
      this.lowEnergyAdvertisementTimeoutCheck(2 * 60 * 1000)
    );
    healthIndicatorService?.registerHealthIndicator(async () =>
      this.successiveErrorCheck(3)
    );
  }

  lowEnergyAdvertisementTimeoutCheck(threshold: number): HealthIndicatorResult {
    const isHealthy = this.bluetoothService.timeSinceLastDiscovery < threshold;
    const result = this.getStatus('ble_advertisement_timeout', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError(
      `No BLE advertisements recorded in over ${threshold}ms`,
      result
    );
  }

  successiveErrorCheck(threshold: number): HealthIndicatorResult {
    const isHealthy =
      this.bluetoothService.successiveErrorsOccurred < threshold;
    const result = this.getStatus(`bt_successive_errors`, isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError(
      'BT Classic successive error check failed',
      result
    );
  }
}
