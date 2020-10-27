import { Tag } from './tag';
import { Peripheral } from '@abandonware/noble';

export class IBeacon extends Tag {
  constructor(
    peripheral: Peripheral,
    majorMask = 0xffff,
    minorMask = 0xffff,
    batteryMask = 0x00000000
  ) {
    super(peripheral);
    this.uuid = this.peripheral.advertisement.manufacturerData
      .slice(4, 20)
      .toString('hex');
    const major = this.peripheral.advertisement.manufacturerData.readUInt16BE(
      20
    );
    const minor = this.peripheral.advertisement.manufacturerData.readUInt16BE(
      22
    );
    this.measuredPower = this.peripheral.advertisement.manufacturerData.readInt8(
      24
    );

    this._rawMajorMinor = (major << 16) + minor;
    this.major = major & majorMask;
    this.minor = minor & minorMask;
    this.batteryMask = batteryMask;
  }

  uuid: string;
  major: number;
  minor: number;
  batteryMask: number;
  private _rawMajorMinor: number;

  get id(): string {
    return `${this.uuid}-${this.major}-${this.minor}`;
  }

  get batteryLevel() {
    if (!this.batteryMask) {
      return undefined;
    }

    const battery = this._rawMajorMinor & this.batteryMask;
    const offset = Math.log2(this.batteryMask & -this.batteryMask);
    return battery >> offset;
  }
}
