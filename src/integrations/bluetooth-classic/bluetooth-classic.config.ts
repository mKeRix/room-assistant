export class BluetoothClassicConfig {
  addresses: string[] = [];
  minRssi?: number | { [address: string]: number };
  hciDeviceId = 0;
  interval = 10;
  scanTimeLimit = 6;
  timeoutCycles = 2;
  preserveState = false;
  inquireFromStart = true;
  entityOverrides: { [key: string]: BluetoothClassicEntityOverride } = {};
}

class BluetoothClassicEntityOverride {
  id?: string;
}
