import { IsDefined, IsInt, IsString, IsOptional } from 'class-validator';
import { BinarySensorDeviceClass } from '../home-assistant/binary-sensor-config';

class GpioBinarySensorOptions {
  @IsString()
  name: string;
  @IsInt()
  pin: number;
  // TODO @IsInstance(BinarySensorDeviceClass)
  @IsOptional()
  deviceClass?: BinarySensorDeviceClass;
}

class GpioSwitchOptions {
  @IsString()
  name: string;
  @IsInt()
  pin: number;
  @IsString()
  @IsOptional()
  icon?: string;
}

export class GpioConfig {
  // TODO need to revisit
  @IsDefined()
  binarySensors: GpioBinarySensorOptions[] = [];
  @IsDefined()
  switches: GpioSwitchOptions[] = [];
}
