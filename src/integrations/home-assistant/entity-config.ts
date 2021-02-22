import { Device } from './device';

export abstract class EntityConfig {
  uniqueId: string;
  component: string;
  name: string;

  device: Device;

  configTopic: string;
  stateTopic: string;
  jsonAttributesTopic: string;
  availabilityTopic: string;
  payloadAvailable = 'online';
  payloadNotAvailable = 'offline';

  protected constructor(
    component: string,
    id: string,
    name: string,
    device?: Device
  ) {
    this.component = component;
    this.name = name;
    this.device = device;

    this.uniqueId = `room-assistant-${id}`;
    this.configTopic = `${this.component}/room-assistant/${id}/config`;
    this.stateTopic = `room-assistant/${this.component}/${id}/state`;
    this.jsonAttributesTopic = `room-assistant/${this.component}/${id}/attributes`;
    this.availabilityTopic = `room-assistant/${this.component}/${id}/status`;
  }
}
