import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

let notify;
try {
  notify = require('sd-notify');
} catch (e) {
  notify = undefined;
}

@Injectable()
export class HealthIndicatorService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private healthIndicators: HealthIndicatorFunction[] = [];
  private readonly logger: Logger = new Logger(HealthIndicatorService.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    if (notify == undefined) {
      this.logger.debug(
        'Systemd watchdog reporting is unavailable, as the optional sd-notify dependency could not be loaded'
      );
    }

    notify?.ready();

    const watchdogInterval: number = notify?.watchdogInterval();
    if (watchdogInterval > 0) {
      const interval = Math.floor(watchdogInterval / 2);
      const notifyInterval = setInterval(
        this.updateWatchdog.bind(this),
        interval
      );
      this.schedulerRegistry.addInterval(
        'health-indicator-watchdog',
        notifyInterval
      );
    }
  }

  /**
   * Lifecycle hook, called after the shutdown sequence was initiated.
   */
  onModuleDestroy(): void {
    notify?.stopping();
  }

  /**
   * Returns all registered health indicator functions from the integrations.
   */
  getIndicators(): HealthIndicatorFunction[] {
    return this.healthIndicators;
  }

  /**
   * Registers a new health indicator.
   *
   * @param healthIndicatorFunction - Function that checks for service health
   */
  registerHealthIndicator(
    healthIndicatorFunction: HealthIndicatorFunction
  ): void {
    this.healthIndicators.push(healthIndicatorFunction);
  }

  /**
   * Checks for overall application health.
   */
  check(): Promise<HealthCheckResult> {
    return this.health.check(this.getIndicators());
  }

  /**
   * Sends a heartbeat to the systemd watchdog if the application is healthy.
   */
  private async updateWatchdog(): Promise<void> {
    try {
      const healthResult = await this.check();
      if (healthResult.status != 'error') {
        notify.watchdog();
      }
    } catch (e) {
      if (!(e instanceof ServiceUnavailableException)) {
        throw e;
      }
    }
  }
}
