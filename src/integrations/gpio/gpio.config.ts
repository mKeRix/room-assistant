import { BinarySensorDeviceClass } from '../home-assistant/binary-sensor-config';
import * as jf from 'joiful';

class GpioBinarySensorOptions {
  @(jf.string().required())
  name: string;
  @(jf.number().integer().required())
  pin: number;
  @(jf.string().valid(Object.values(BinarySensorDeviceClass)).optional())
  deviceClass?: BinarySensorDeviceClass;
}

class GpioSwitchOptions {
  @(jf.string().required())
  name: string;
  @(jf.number().integer())
  pin: number;
  @(jf.string().optional())
  icon?: string;
}

export class GpioConfig {
  @(jf.array({ elementClass: GpioBinarySensorOptions }).required())
  binarySensors: GpioBinarySensorOptions[] = [];
  @(jf.array({ elementClass: GpioSwitchOptions }).required())
  switches: GpioSwitchOptions[] = [];
}
