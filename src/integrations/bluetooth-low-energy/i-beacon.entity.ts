import { Tag } from './tag.entity';
import { Peripheral } from '@abandonware/noble';

export class IBeacon extends Tag {
  constructor(
    peripheral: Peripheral,
    majorMask: number = 0xffff,
    minorMask: number = 0xffff
  ) {
    super(peripheral);
    this.uuid = this.peripheral.advertisement.manufacturerData
      .slice(4, 20)
      .toString('hex');
    this.major =
      this.peripheral.advertisement.manufacturerData.readUInt16BE(20) &
      majorMask; // tslint:disable-line:no-bitwise
    this.minor =
      this.peripheral.advertisement.manufacturerData.readUInt16BE(22) &
      minorMask; // tslint:disable-line:no-bitwise
    this.measuredPower = this.peripheral.advertisement.manufacturerData.readInt8(
      24
    );
  }

  uuid: string;
  major: number;
  minor: number;

  get id() {
    return `${this.uuid}-${this.major}-${this.minor}`;
  }
}
