import { Gpio } from 'onoff';
import { GpioSwitch } from './gpio.switch';

jest.mock('onoff');

describe('GpioSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write 1 to the GPIO pin when turned on', async () => {
    const pin = new Gpio(17, 'out');
    const gpioSwitch = new GpioSwitch('test', 'Test', pin);

    await gpioSwitch.turnOn();
    expect(pin.write).toHaveBeenCalledWith(1);
    expect(gpioSwitch.state).toBeTruthy();
  });

  it('should write 0 to the GPIO pin when turned off', async () => {
    const pin = new Gpio(17, 'out');
    const gpioSwitch = new GpioSwitch('test', 'Test', pin);

    await gpioSwitch.turnOff();
    expect(pin.write).toHaveBeenCalledWith(0);
    expect(gpioSwitch.state).toBeFalsy();
  });
});
