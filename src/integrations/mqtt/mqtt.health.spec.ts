import { mocked } from 'ts-jest/utils';
import { MqttService } from './mqtt.service';
import { MqttHealthIndicator } from './mqtt.health';
import { HealthCheckError } from '@nestjs/terminus';

jest.mock('./mqtt.service');

describe('MqttHealthIndicator', () => {
  const serviceMock = mocked(
    new MqttService(undefined, undefined, undefined, undefined)
  );
  const healthIndicator = new MqttHealthIndicator(serviceMock);

  it('should report healthy if connection is established', () => {
    serviceMock.isConnected.mockReturnValue(true);

    const result = healthIndicator.connectionCheck();
    expect(result['mqtt_connected'].status).toEqual('up');
  });

  it('should report unhealthy if connection not established yet', () => {
    serviceMock.isConnected.mockReturnValue(undefined);

    expect(() => healthIndicator.connectionCheck()).toThrow(HealthCheckError);
  });

  it('should report unhealthy if connection lost', () => {
    serviceMock.isConnected.mockReturnValue(false);

    expect(() => healthIndicator.connectionCheck()).toThrow(HealthCheckError);
  });
});
