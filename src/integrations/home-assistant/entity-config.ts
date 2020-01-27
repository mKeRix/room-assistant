import { Device } from './device';
import slugify from 'slugify';
import * as _ from 'lodash';

export abstract class EntityConfig {
  uniqueId: string;
  component: string;
  name: string;

  device: Device;

  configTopic: string;
  stateTopic: string;
  jsonAttributesTopic: string;
  availabilityTopic: string;
  payloadAvailable: string = 'online';
  payloadNotAvailable: string = 'offline';

  constructor(component: string, id: string, name: string, device?: Device) {
    this.component = component;
    this.name = name;
    this.device = device;

    this.uniqueId = slugify(_.lowerCase(`room-assistant ${component} ${id}`));
    this.configTopic = `homeassistant/${this.component}/${this.uniqueId}/config`;
    this.stateTopic = `roomassistant/${this.component}/${this.uniqueId}/state`;
    this.jsonAttributesTopic = `roomassistant/${this.component}/${this.uniqueId}/attributes`;
    this.availabilityTopic = `roomassistant/${this.component}/${this.uniqueId}/status`;
  }
}
