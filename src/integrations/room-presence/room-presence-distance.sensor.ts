import { Sensor } from '../../entities/sensor';

export const STATE_NOT_HOME = 'not_home';

class TimedDistance {
  distance: number;
  outOfRange: boolean;
  lastUpdatedAt: Date = new Date();

  constructor(distance: number, outOfRange = false) {
    this.distance = distance;
    this.outOfRange = outOfRange;
  }
}

export class RoomPresenceDistanceSensor extends Sensor {
  timeout: number;
  distances: { [instance: string]: TimedDistance } = {};

  constructor(id: string, name: string, timeout: number) {
    super(id, name, true);
    this.timeout = timeout;
  }

  /**
   * Accepts a new distance value from a given instance name and will update the sensor state accordingly.
   *
   * @param instanceName - Name of the instance from which the distance was measured
   * @param distance - Distance to the matching device
   * @param outOfRange - If the distance is considered too far away from the instance
   */
  handleNewDistance(
    instanceName: string,
    distance: number,
    outOfRange = false
  ): void {
    this.distances[instanceName] = new TimedDistance(distance, outOfRange);
    this.updateState();
  }

  /**
   * Updates the sensor state and attributes based on the recorded distances.
   */
  updateState(): void {
    const closestInRange = this.getClosestInRange();

    if (closestInRange) {
      if (this.state !== closestInRange[0]) {
        this.state = closestInRange[0];
      }

      if (this.state === closestInRange[0]) {
        this.attributes.distance = closestInRange[1].distance;
        this.attributes.lastUpdatedAt = closestInRange[1].lastUpdatedAt.toISOString();
      }
    } else if (this.state !== STATE_NOT_HOME) {
      this.setNotHome();
    }
  }

  /**
   * Determines the closest instance.
   *
   * @returns Tuple of the instance name and the timed distance to it
   */
  protected getClosestInRange(): [string, TimedDistance] {
    const distances = Array.from(Object.entries(this.distances))
      .filter(value => {
        return (
          !value[1].outOfRange &&
          (this.timeout <= 0 ||
            Date.now() < value[1].lastUpdatedAt.getTime() + this.timeout * 1000)
        );
      })
      .sort((a, b) => {
        return a[1].distance - b[1].distance;
      });
    return distances.length > 0 ? distances[0] : undefined;
  }

  /**
   * Marks the sensor as not_home.
   */
  protected setNotHome(): void {
    this.state = STATE_NOT_HOME;
    this.attributes.distance = undefined;
    this.attributes.lastUpdatedAt = new Date().toISOString();
  }
}
