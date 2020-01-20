import { Peripheral } from '@abandonware/noble';

export class Tag {
  constructor(peripheral: Peripheral) {
    this.peripheral = peripheral;
    this.rssi = peripheral.rssi;
    // -59 is a somewhat reasonable default
    this.measuredPower = peripheral.advertisement.txPowerLevel || -59.0;
  }

  peripheral: Peripheral;
  rssi: number;
  measuredPower: number;

  get id(): string {
    return this.peripheral.id;
  }

  get distance(): string {
    if (this.rssi === 0) {
      return '-1';
    }

    const ratio = this.rssi / this.measuredPower;
    if (ratio < 1) {
      return Math.pow(ratio, 10).toFixed(1);
    } else {
      return (0.89976 * Math.pow(ratio, 7.7095) + 0.111).toFixed(1);
    }
  }
}
