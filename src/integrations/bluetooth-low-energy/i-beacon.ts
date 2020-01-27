import { Tag } from './tag';
import { Peripheral } from '@abandonware/noble';

export class IBeacon extends Tag {
  constructor(peripheral: Peripheral, majorMask = 0xffff, minorMask = 0xffff) {
    super(peripheral);
    this.uuid = this.peripheral.advertisement.manufacturerData
      .slice(4, 20)
      .toString('hex');
    this.major =
      this.peripheral.advertisement.manufacturerData.readUInt16BE(20) &
      majorMask;
    this.minor =
      this.peripheral.advertisement.manufacturerData.readUInt16BE(22) &
      minorMask;
    this.measuredPower = this.peripheral.advertisement.manufacturerData.readInt8(
      24
    );
  }

  uuid: string;
  major: number;
  minor: number;

  get id(): string {
    return `${this.uuid}-${this.major}-${this.minor}`;
  }
}
