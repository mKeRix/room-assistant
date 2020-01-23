import { Sensor } from '../../entities/sensor.entity';

export class BluetoothClassicSensor extends Sensor {
  timeout: number;

  handleNewRssi(instanceName: string, rssi: number, timeout: number): void {
    this.timeout = timeout;
    const lastRssi = this.attributes.rssi as number;
    const lastUpdate = Date.parse(this.attributes.last_updated_at as string);
    const timeoutLimit = new Date(lastUpdate + this.timeout * 1000);

    if (this.state !== instanceName) {
      if (
        lastRssi === undefined ||
        rssi < lastRssi ||
        (this.timeout > 0 && Date.now() > timeoutLimit.getTime())
      ) {
        this.state = instanceName;
      }
    }

    if (this.state === instanceName) {
      this.attributes.rssi = rssi;
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
