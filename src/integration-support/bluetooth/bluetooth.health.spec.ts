import { BluetoothHealthIndicator } from './bluetooth.health';
import { HealthCheckError } from '@nestjs/terminus';
import { BluetoothService } from './bluetooth.service';

describe('BluetoothHealthIndicator', () => {
  let healthIndicator: BluetoothHealthIndicator;
  let mockBluetoothService: any;

  beforeEach(() => {
    mockBluetoothService = {
      successiveErrorsOccurred: 0,
      timeSinceLastDiscovery: null,
    } as BluetoothService;
    healthIndicator = new BluetoothHealthIndicator(mockBluetoothService);
  });

  describe('ble_advertisement_timeout', () => {
    it('should report healthy by default', () => {
      const result = healthIndicator.lowEnergyAdvertisementTimeoutCheck(
        2 * 60 * 1000
      );
      expect(result['ble_advertisement_timeout'].status).toEqual('up');
    });

    it('should report unhealthy after meeting the threshold', () => {
      mockBluetoothService.timeSinceLastDiscovery = 120000;

      expect(() =>
        healthIndicator.lowEnergyAdvertisementTimeoutCheck(2 * 60 * 1000)
      ).toThrow(HealthCheckError);
    });
  });

  describe('bt_successive_errors', () => {
    it('should report healthy by default', () => {
      const result = healthIndicator.successiveErrorCheck(3);
      expect(result['bt_successive_errors'].status).toEqual('up');
    });

    it('should report unhealthy after meeting the threshold', () => {
      mockBluetoothService.successiveErrorsOccurred = 3;

      expect(() => healthIndicator.successiveErrorCheck(3)).toThrow(
        HealthCheckError
      );
    });
  });
});
