import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import { Injectable, Optional } from "@nestjs/common";
import { MqttService } from "./mqtt.service";
import { HealthIndicatorService } from "../../status/health-indicator.service";

@Injectable()
export class MqttHealthIndicator extends HealthIndicator {
  constructor(private readonly mqttService: MqttService, @Optional() healthIndicatorService?: HealthIndicatorService) {
    super();
    healthIndicatorService?.registerHealthIndicator(async () =>
      this.connectionCheck()
    );
  }

  connectionCheck(): HealthIndicatorResult {
    const isHealthy = this.mqttService.isConnected();
    const result = this.getStatus('mqtt_connected', isHealthy);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('No connection to MQTT broker', result);
  }
}
