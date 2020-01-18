import { EntityConfig } from './entity-config';

export class BinarySensorConfig extends EntityConfig {
  component = 'binary_sensor';

  payloadOn = '1';
  payloadOff = '0';
}
