export class NewRssiEvent {
  instanceName: string;
  address: string;
  rssi: number;

  constructor(instanceName: string, address: string, rssi: number) {
    this.instanceName = instanceName;
    this.address = address;
    this.rssi = rssi;
  }
}
