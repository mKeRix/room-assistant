import { Device } from './device';

export const PROPERTY_DENYLIST = [
  'component',
  'configTopic',
  'commandStore',
  '_instanceStatusTopic',
  '_entityStatusTopic',
  'distributed',
  'stateLocked',
];

export type AvailabilityStatus = 'online' | 'offline';
type AvailabilityMode = 'all' | 'any' | 'latest';

export class Availability {
  payloadAvailable: AvailabilityStatus = 'online';
  payloadNotAvailable: AvailabilityStatus = 'offline';

  constructor(public topic: string) {}
}

export abstract class EntityConfig {
  uniqueId: string;
  component: string;
  name: string;

  device: Device;

  configTopic: string;
  stateTopic: string;
  jsonAttributesTopic: string;
  availabilityMode: AvailabilityMode = 'all';

  distributed = false;
  stateLocked = true;

  private _instanceStatusTopic: string;
  private readonly _entityStatusTopic: string;

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
    this._entityStatusTopic = `room-assistant/${this.component}/${id}/status`;
  }

  get availability(): Array<Availability> {
    if (this.distributed && !this.stateLocked) {
      return [];
    } else {
      return [
        new Availability(this._entityStatusTopic),
        new Availability(this._instanceStatusTopic),
      ];
    }
  }

  setInstanceStatusTopic(topic: string): void {
    this._instanceStatusTopic = topic;
  }

  shallowClone(): Record<string, unknown> {
    const clone: Record<string, unknown> = Object.assign({}, this) as Record<
      string,
      unknown
    >;
    clone.availability = this.availability;
    return clone;
  }
}
