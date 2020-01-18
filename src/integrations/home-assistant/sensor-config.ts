import { EntityConfig } from './entity-config';

export class SensorConfig extends EntityConfig {
  constructor(id: string, name: string) {
    super('sensor', id, name);
  }

  unitOfMeasurement: string;
  icon: string;
  deviceClass: string;
}
