import { Switch } from '../../entities/switch';
import { Gpio } from 'onoff';

export class GpioSwitch extends Switch {
  private gpio: Gpio;

  constructor(id: string, name: string, gpio: Gpio) {
    super(id, name, false);
    this.gpio = gpio;
  }

  async turnOn(): Promise<void> {
    await this.gpio.write(1);
    super.turnOn();
  }

  async turnOff(): Promise<void> {
    await this.gpio.write(0);
    super.turnOff();
  }
}
