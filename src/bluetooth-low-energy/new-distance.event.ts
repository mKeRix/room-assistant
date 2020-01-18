export class NewDistanceEvent {
  constructor(instanceName: string, tagId: string, distance: number) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.distance = distance;
  }

  instanceName: string;
  tagId: string;
  distance: number;
}
