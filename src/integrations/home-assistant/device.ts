import { VERSION } from '../../app.module';

export class Device {
  constructor(identifiers: string | string[]) {
    this.identifiers = identifiers;
  }

  identifiers: string | string[];
  connections: string[][];
  manufacturer: string;
  model: string;
  name: string;
  swVersion: string = VERSION;
}
