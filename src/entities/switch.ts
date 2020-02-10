import { Entity } from './entity';

export class Switch extends Entity {
  state: boolean;

  turnOn(): void {
    this.state = true;
  }

  turnOff(): void {
    this.state = false;
  }
}
