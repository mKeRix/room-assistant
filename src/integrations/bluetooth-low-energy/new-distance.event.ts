export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    peripheralId: string,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange = false,
    appId?: string,
    batteryLevel?: number
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.peripheralId = peripheralId;
    this.rssi = rssi;
    this.measuredPower = measuredPower;
    this.distance = distance;
    this.outOfRange = outOfRange;
    this.appId = appId;
    this.batteryLevel = batteryLevel;
  }

  get isApp(): boolean {
    return this.appId != undefined;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  peripheralId: string;
  rssi: number;
  measuredPower: number;
  distance: number;
  outOfRange: boolean;
  appId?: string;
  batteryLevel?: number;
}
