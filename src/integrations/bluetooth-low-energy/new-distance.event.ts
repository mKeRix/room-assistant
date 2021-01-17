export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    peripheralId: string,
    discoverySuccessful: boolean,
    isApp: boolean,
    rssi: number,
    measuredPower: number,
    distance: number,
    outOfRange = false,
    batteryLevel?: number
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.peripheralId = peripheralId;
    this.discoverySuccessful = discoverySuccessful;
    this.isApp = isApp;
    this.rssi = rssi;
    this.measuredPower = measuredPower;
    this.distance = distance;
    this.outOfRange = outOfRange;
    this.batteryLevel = batteryLevel;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  peripheralId: string;
  discoverySuccessful: boolean;
  isApp: boolean;
  rssi: number;
  measuredPower: number;
  distance: number;
  outOfRange: boolean;
  batteryLevel?: number;
}
