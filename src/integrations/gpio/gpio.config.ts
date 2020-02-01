import { BinarySensorDeviceClass } from '../home-assistant/binary-sensor-config';

export class GpioConfig {
  binarySensors: GpioBinarySensorOptions[] = [];
}

class GpioBinarySensorOptions {
  name: string;
  pin: number;
  deviceClass?: BinarySensorDeviceClass;
}
