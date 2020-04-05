import { BinarySensorDeviceClass } from '../home-assistant/binary-sensor-config';

export class GpioConfig {
  binarySensors: GpioBinarySensorOptions[] = [];
  switches: GpioSwitchOptions[] = [];
}

class GpioBinarySensorOptions {
  name: string;
  pin: number;
  deviceClass?: BinarySensorDeviceClass;
}

class GpioSwitchOptions {
  name: string;
  pin: number;
  icon?: string;
}
