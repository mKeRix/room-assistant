export class BluetoothClassicConfig {
  addresses: string[] = [];
  minRssi?: number | { [address: string]: number };
  hciDeviceId = 0;
  interval = 6;
  scanTimeLimit = 2;
  timeoutCycles = 2;
  preserveState = false;
  inquireFromStart = true;
}
