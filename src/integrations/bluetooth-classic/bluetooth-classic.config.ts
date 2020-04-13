export class BluetoothClassicConfig {
  addresses: string[] = [];
  minRssi?: number | { [address: string]: number };
  hciDeviceId = 0;
  interval = 6;
  timeoutCycles = 2;
}
