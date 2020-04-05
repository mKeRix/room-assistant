import { Switch } from '../../entities/switch';
import * as util from 'util';
import { exec } from 'child_process';
import { Logger } from '@nestjs/common';

const execPromise = util.promisify(exec);

export class ShellSwitch extends Switch {
  onCommand: string;
  offCommand: string;

  constructor(id: string, name: string, onCommand: string, offCommand: string) {
    super(id, name, false);
    this.onCommand = onCommand;
    this.offCommand = offCommand;
  }

  async turnOn(): Promise<void> {
    try {
      await execPromise(this.onCommand);
      super.turnOn();
    } catch (e) {
      Logger.error(
        `Turning ${this.id} on failed: ${e.message}`,
        e.stack,
        ShellSwitch.name
      );
    }
  }

  async turnOff(): Promise<void> {
    try {
      await execPromise(this.offCommand);
      super.turnOff();
    } catch (e) {
      Logger.error(
        `Turning ${this.id} off failed: ${e.message}`,
        e.stack,
        ShellSwitch.name
      );
    }
  }
}
