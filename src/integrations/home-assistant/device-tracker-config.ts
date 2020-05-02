import { EntityConfig } from './entity-config';

export class DeviceTrackerConfig extends EntityConfig {
  readonly payloadHome = 'true';
  readonly payloadNotHome = 'false';

  constructor(id: string, name: string) {
    super('device_tracker', id, name);
  }
}
