export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange = false
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.rssi = rssi;
    this.measuredPower = measuredPower;
    this.distance = distance;
    this.outOfRange = outOfRange;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  rssi: number;
  measuredPower: number;
  distance: number;
  outOfRange: boolean;
}
