export abstract class Entity {
  constructor(id: string, name: string, distributed: boolean = false) {
    this.id = id;
    this.name = name;
    this.distributed = distributed;
  }

  readonly id: string;
  name: string;
  state: string | number | boolean;
  attributes: { [key: string]: any } = {};
  readonly distributed: boolean;
}
