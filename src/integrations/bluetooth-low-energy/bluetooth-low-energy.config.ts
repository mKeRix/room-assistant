import { randomInt } from "../../util/numbers";
import {
  IsOptional,
  IsInt,
  IsBoolean,
  IsString,
  Min,
  Max,
  IsPositive,
  IsNegative,
} from 'class-validator';

export class BluetoothLowEnergyConfig {
  @IsInt()
  @Min(0)
  hciDeviceId = 0;

  @IsString({ each: true })
  whitelist: string[] = [];
  @IsBoolean()
  whitelistRegex = false;
  @IsString({ each: true })
  allowlist: string[] = [];
  @IsBoolean()
  allowlistRegex = false;
  @IsString({ each: true })
  blacklist: string[] = [];
  @IsBoolean()
  blacklistRegex = false;
  @IsString({ each: true })
  denylist: string[] = [];
  @IsBoolean()
  denylistRegex = false;
  @IsBoolean()
  processIBeacon = true;
  @IsBoolean()
  onlyIBeacon = false;
  @Min(0)
  @Max(0xffff)
  majorMask = 0xffff;
  @Min(0)
  @Max(0xffff)
  minorMask = 0xffff;
  @IsInt()
  batteryMask = 0x00000000;
  @IsOptional()
  tagOverrides: { [key: string]: TagOverride } = {};

  instanceBeaconEnabled = true;
  instanceBeaconMajor = 1;
  instanceBeaconMinor = randomInt(0, 65535);

  @IsPositive()
  timeout = 60;
  @Min(0)
  updateFrequency = 0;
  @IsInt()
  @IsPositive()
  @IsOptional()
  maxDistance?: number;
}

class TagOverride {
  @IsOptional()
  @IsString()
  id?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsNegative()
  measuredPower?: number;
  @IsOptional()
  @IsInt()
  batteryMask?: number;
}
