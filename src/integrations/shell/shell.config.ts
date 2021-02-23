import { IsOptional, IsString, ValidateNested } from 'class-validator';

class ShellSwitchOptions {
  @IsString()
  name: string;
  @IsString()
  onCommand: string;
  @IsString()
  offCommand: string;
  @IsString()
  @IsOptional()
  icon?: string;
}

class ShellSensorOptions {
  @IsString()
  name: string;
  @IsString()
  command: string;
  @IsString()
  @IsOptional()
  regex?: string;
  @IsString()
  cron: string;
  @IsString()
  @IsOptional()
  icon?: string;
  @IsString()
  @IsOptional()
  unitOfMeasurement?: string;
  @IsString()
  @IsOptional()
  deviceClass?: string;
}
export class ShellConfig {
  // TODO need to revist
  @ValidateNested()
  sensors: ShellSensorOptions[] = [];
  @ValidateNested()
  switches: ShellSwitchOptions[] = [];
}
