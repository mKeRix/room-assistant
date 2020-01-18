/* tslint:disable:max-classes-per-file */
export class BluetoothLowEnergyConfig {
  whitelist: string[] = [];
  whitelistRegex: boolean = false;
  processIBeacon: boolean = true;
  onlyIBeacon: boolean = false;
  majorMask: number = 0xffff;
  minorMask: number = 0xffff;
  tagOverrides: { [key: string]: TagOverride } = {};

  timeout: number = 5;
}

class TagOverride {
  measuredPower: number;
}
