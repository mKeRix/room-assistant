export class BluetoothClassicConfig {
  addresses: string[] = [];
  minRssi?: number;
  hciDeviceId = 0;
  interval = 6;
  timeoutCycles = 2;
}
