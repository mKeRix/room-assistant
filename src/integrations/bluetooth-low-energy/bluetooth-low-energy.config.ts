export class BluetoothLowEnergyConfig {
  hciDeviceId = 0;
  whitelist: string[] = [];
  whitelistRegex = false;
  blacklist: string[] = [];
  blacklistRegex = false;
  processIBeacon = true;
  onlyIBeacon = false;
  majorMask = 0xffff;
  minorMask = 0xffff;
  batteryMask = 0x00000000;
  tagOverrides: { [key: string]: TagOverride } = {};

  timeout = 5;
  updateFrequency = 0;
  maxDistance?: number;
}

class TagOverride {
  name?: string;
  measuredPower?: number;
  batteryMask?: number;
}
