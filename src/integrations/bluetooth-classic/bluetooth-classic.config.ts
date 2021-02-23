import {
  IsBoolean,
  IsInt,
  IsMACAddress,
  IsOptional,
  Min,
} from 'class-validator';
export class BluetoothClassicConfig {
  @IsMACAddress({ each: true })
  addresses: string[] = [];
  @IsOptional() // TODO: Need to see if we can better match this one
  minRssi?: number | { [address: string]: number };
  @IsInt()
  @Min(0)
  hciDeviceId = 0;
  @IsInt()
  @Min(0)
  interval = 10;
  @IsInt()
  @Min(0)
  scanTimeLimit = 6;
  @IsInt()
  @Min(0)
  timeoutCycles = 2;
  @IsBoolean()
  preserveState = false;
  @IsBoolean()
  inquireFromStart = true;
  entityOverrides: { [key: string]: BluetoothClassicEntityOverride } = {};
}

class BluetoothClassicEntityOverride {
  id?: string;
}
