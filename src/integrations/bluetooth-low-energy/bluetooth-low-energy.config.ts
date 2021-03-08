import { randomInt } from "../../util/numbers";

export class BluetoothLowEnergyConfig {
  hciDeviceId = 0;
  whitelist: string[] = [];
  whitelistRegex = false;
  allowlist: string[] = [];
  allowlistRegex = false;
  blacklist: string[] = [];
  blacklistRegex = false;
  denylist: string[] = [];
  denylistRegex = false;
  processIBeacon = true;
  onlyIBeacon = false;
  majorMask = 0xffff;
  minorMask = 0xffff;
  batteryMask = 0x00000000;
  tagOverrides: { [key: string]: TagOverride } = {};

  instanceBeaconEnabled = true;
  instanceBeaconMajor = 1;
  instanceBeaconMinor = randomInt(0, 65535);

  timeout = 60;
  updateFrequency = 0;
  maxDistance?: number;
}

class TagOverride {
  id?: string;
  name?: string;
  measuredPower?: number;
  batteryMask?: number;
}
