import { BluetoothHealthIndicator } from './bluetooth.health';
import { HealthCheckError } from '@nestjs/terminus';

describe('BluetoothHealthIndicator', () => {
  let healthIndicator: BluetoothHealthIndicator;

  beforeEach(() => {
    healthIndicator = new BluetoothHealthIndicator();
  });

  it('should report healthy by default', () => {
    const result = healthIndicator.successiveErrorCheck(3);
    expect(result['bt_successive_errors'].status).toEqual('up');
  });

  it('should report unhealthy after meeting the threshold', () => {
    healthIndicator.reportError();
    healthIndicator.reportError();
    healthIndicator.reportError();

    expect(() => healthIndicator.successiveErrorCheck(3)).toThrow(
      HealthCheckError
    );
  });

  it('should reset the error count on success', () => {
    healthIndicator.reportError();
    healthIndicator.reportError();
    healthIndicator.reportError();
    healthIndicator.reportSuccess();

    const result = healthIndicator.successiveErrorCheck(3);
    expect(result['bt_successive_errors'].status).toEqual('up');
  });
});
