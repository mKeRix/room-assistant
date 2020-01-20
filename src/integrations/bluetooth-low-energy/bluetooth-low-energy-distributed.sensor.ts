import { Sensor } from '../../entities/sensor.entity';

export class BluetoothLowEnergyDistributedSensor extends Sensor {
  timeout: number;

  constructor(id: string, name: string, timeout: number) {
    super(id, name, true);
    this.timeout = timeout;
  }

  handleNewDistance(instanceName: string, distance: number): void {
    const lastDistance = this.attributes.distance as number;
    const lastUpdate = Date.parse(this.attributes.last_updated_at as string);
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
      this.attributes.last_updated_at = new Date().toISOString();
    }
  }

  checkForTimeout(): void {
    if (this.state !== 'not_home') {
      const lastUpdate = Date.parse(this.attributes.last_updated_at as string);
      const timeoutLimit = new Date(lastUpdate + this.timeout * 1000);

      if (this.timeout > 0 && Date.now() > timeoutLimit.getTime()) {
        this.state = 'not_home';
        this.attributes.distance = undefined;
        this.attributes.last_updated_at = new Date().toISOString();
      }
    }
  }
}
