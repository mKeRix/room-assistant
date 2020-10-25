import { Peripheral } from '@abandonware/noble';
import _ from 'lodash';

export class Tag {
  private _id;
  private _name;

  constructor(peripheral: Peripheral) {
    this.peripheral = peripheral;
    this.rssi = peripheral.rssi;
    // -59 is a somewhat reasonable default
    this.measuredPower = -59.0;
  }

  peripheral: Peripheral;
  rssi: number;
  measuredPower: number;

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id || this.peripheral.id;
  }

  get name(): string {
    return this._name || this.peripheral.advertisement.localName || this.id;
  }

  set name(name: string) {
    this._name = name;
  }

  get distance(): number {
    if (this.rssi === 0) {
      return undefined;
    }

    const ratio = this.rssi / this.measuredPower;
    if (ratio < 1) {
      return _.round(Math.pow(ratio, 10), 1);
    } else {
      return _.round(0.89976 * Math.pow(ratio, 7.7095) + 0.111, 1);
    }
  }
}
