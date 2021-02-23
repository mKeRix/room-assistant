import {
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
export class RollingAverageOptions {
  @IsInt()
  @Min(0)
  @IsOptional()
  window?: number;
}
export class DebounceOptions {
  @IsInt()
  @Min(0)
  @IsOptional()
  wait?: number;
  @IsInt()
  @Min(0)
  @IsOptional()
  maxWait?: number;
  @IsBoolean()
  leading: boolean;
  @IsBoolean()
  @IsOptional()
  trailing?: boolean;
}

export class EntityBehavior {
  @ValidateNested()
  @IsOptional()
  debounce?: DebounceOptions;
  @ValidateNested()
  @IsOptional()
  rollingAverage?: RollingAverageOptions;
}

export class EntitiesConfig {
  @ValidateNested() // TODO need to revisit
  behaviors: { [entityId: string]: EntityBehavior } = {};
}
