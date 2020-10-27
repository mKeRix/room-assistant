import { EntityConfig } from './entity-config';

import {
  STATE_HOME,
  STATE_NOT_HOME,
} from '../room-presence/room-presence-distance.sensor';

export class DeviceTrackerConfig extends EntityConfig {
  readonly payloadHome = STATE_HOME;
  readonly payloadNotHome = STATE_NOT_HOME;
  readonly sourceType = 'bluetooth_le';

  constructor(id: string, name: string) {
    super('device_tracker', id, name);
  }
}
