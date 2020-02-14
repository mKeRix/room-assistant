export class NewRssiEvent {
  instanceName: string;
  address: string;
  rssi: number;
  outOfRange: boolean;

  constructor(
    instanceName: string,
    address: string,
    rssi: number,
    outOfRange = false
  ) {
    this.instanceName = instanceName;
    this.address = address;
    this.rssi = rssi;
    this.outOfRange = outOfRange;
  }
}
