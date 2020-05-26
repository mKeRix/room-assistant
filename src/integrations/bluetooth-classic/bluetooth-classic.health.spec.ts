import { BluetoothClassicHealthIndicator } from './bluetooth-classic.health';
import { HealthCheckError } from '@nestjs/terminus';

describe('BluetoothClassicHealthIndicator', () => {
  let healthIndicator: BluetoothClassicHealthIndicator;

  beforeEach(() => {
    healthIndicator = new BluetoothClassicHealthIndicator();
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
