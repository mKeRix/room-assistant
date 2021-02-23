import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
export class XiaomiMiConfig {
  @IsInt()
  @Min(0)
  hciDeviceId = 0;
  @ValidateNested()
  sensors: XiaomiMiSensorOptions[] = [];
}

export class XiaomiMiSensorOptions {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  bindKey?: string;
}
