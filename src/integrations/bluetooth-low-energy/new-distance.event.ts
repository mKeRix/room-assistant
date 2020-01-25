export class NewDistanceEvent {
  constructor(
    instanceName: string,
    tagId: string,
    tagName: string,
    distance: number
  ) {
    this.instanceName = instanceName;
    this.tagId = tagId;
    this.tagName = tagName;
    this.distance = distance;
  }

  instanceName: string;
  tagId: string;
  tagName: string;
  distance: number;
}
