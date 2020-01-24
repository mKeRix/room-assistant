import { Sensor } from '../../entities/sensor.entity';

export const STATE_NOT_HOME = 'not_home';

export class RoomPresenceDistanceSensor extends Sensor {
  timeout: number;

  constructor(id: string, name: string, timeout: number) {
    super(id, name, true);
    this.timeout = timeout;
  }

  /**
   * Accepts a new distance value from a given instance name and will update the sensor state accordingly.
   *
   * @param instanceName - Name of the instance from which the distance was measured
   * @param distance - Distance to the matching device
   */
  handleNewDistance(instanceName: string, distance: number): void {
    const lastDistance = this.attributes.distance as number;
    const lastUpdate = Date.parse(this.attributes.lastUpdatedAt as string);
    const timeoutLimit = new Date(lastUpdate + this.timeout * 1000);

    if (this.state !== instanceName) {
      if (
        lastDistance === undefined ||
        distance < lastDistance ||
        (this.timeout > 0 && Date.now() > timeoutLimit.getTime())
      ) {
        this.state = instanceName;
      }
    }

    if (this.state === instanceName) {
      this.attributes.distance = distance;
      this.attributes.lastUpdatedAt = new Date().toISOString();
    }
  }

  /**
   * Updates the sensor state to STATE_NOT_HOME if the configured timeout has passed.
   */
  checkForTimeout(): void {
    if (this.state !== STATE_NOT_HOME && this.timeout > 0) {
      const lastUpdate = Date.parse(this.attributes.lastUpdatedAt as string);
      const timeoutLimit = new Date(lastUpdate + this.timeout * 1000);

      if (Date.now() > timeoutLimit.getTime()) {
        this.state = STATE_NOT_HOME;
        this.attributes.distance = undefined;
        this.attributes.lastUpdatedAt = new Date().toISOString();
      }
    }
  }
}
