export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    distance: number,
    outOfRange = false
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.distance = distance;
    this.outOfRange = outOfRange;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  distance: number;
  outOfRange: boolean;
}
