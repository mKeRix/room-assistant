export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange = false,
    batteryLevel?: number
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.rssi = rssi;
    this.measuredPower = measuredPower;
    this.distance = distance;
    this.outOfRange = outOfRange;
    this.batteryLevel = batteryLevel;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  rssi: number;
  measuredPower: number;
  distance: number;
  outOfRange: boolean;
  batteryLevel?: number;
}
