import { HomeAssistantHealthIndicator } from './home-assistant.health';
import { HomeAssistantService } from './home-assistant.service';
import { HealthCheckError } from '@nestjs/terminus';

describe('HomeAssistantHealthIndicator', () => {
  const serviceMock = {
    isConnected: jest.fn(),
  };
  const healthIndicator = new HomeAssistantHealthIndicator(
    (serviceMock as unknown) as HomeAssistantService
  );

  it('should report healthy if connection is established', () => {
    serviceMock.isConnected.mockReturnValue(true);

    const result = healthIndicator.connectionCheck();
    expect(result['ha_mqtt_connected'].status).toEqual('up');
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
