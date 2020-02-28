export class BluetoothLowEnergyConfig {
  hciDeviceId = 0;
  whitelist: string[] = [];
  whitelistRegex = false;
  processIBeacon = true;
  onlyIBeacon = false;
  majorMask = 0xffff;
  minorMask = 0xffff;
  tagOverrides: { [key: string]: TagOverride } = {};

  timeout = 5;
  maxDistance?: number;
}

class TagOverride {
  name?: string;
  measuredPower?: number;
}
