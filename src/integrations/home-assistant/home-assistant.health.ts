import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicatorService } from '../../status/health-indicator.service';
import { HomeAssistantService } from './home-assistant.service';

@Injectable()
export class HomeAssistantHealthIndicator extends HealthIndicator {
  constructor(
    private readonly homeAssistantService: HomeAssistantService,
    @Optional() healthIndicatorService?: HealthIndicatorService
  ) {
    super();
    healthIndicatorService?.registerHealthIndicator(async () =>
      this.connectionCheck()
    );
  }

  connectionCheck(): HealthIndicatorResult {
    const isHealthy = this.homeAssistantService.isConnected();
    const result = this.getStatus('ha_mqtt_connected', isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('No connection to MQTT broker', result);
  }
}
