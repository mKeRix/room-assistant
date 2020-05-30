import { EntityConfig } from './entity-config';

export class CameraConfig extends EntityConfig {
  constructor(id: string, name: string) {
    super('camera', id, name);
    this.topic = this.stateTopic;
  }

  readonly topic: string;
}
