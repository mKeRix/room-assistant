import { Entity } from './entity.dto';

export class Switch extends Entity {
  state: boolean;

  turnOn(): void {
    this.state = true;
  }

  turnOff(): void {
    this.state = false;
  }
}
