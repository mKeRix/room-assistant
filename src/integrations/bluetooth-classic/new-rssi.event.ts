import { Device } from './device';

export class NewRssiEvent {
  instanceName: string;
  device: Device;
  rssi: number;
  outOfRange: boolean;

  constructor(
    instanceName: string,
    device: Device,
    rssi: number,
    outOfRange = false
  ) {
    this.instanceName = instanceName;
    this.device = device;
    this.rssi = rssi;
    this.outOfRange = outOfRange;
  }
}
