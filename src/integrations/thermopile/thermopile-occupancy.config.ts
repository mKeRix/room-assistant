import { IsBoolean, IsDefined, IsInt } from 'class-validator';
import { RotationOption } from './thermopile-occupancy.service';

export class HeatmapOptions {
  @IsBoolean()
  enabled = true;
  @IsInt()
  minTemperature = 16;
  @IsInt()
  maxTemperature = 30;
  @IsDefined() // TODO need to explore IsInstance()
  rotation: RotationOption = 0;
  @IsBoolean()
  drawTemperatures = true;
}

// TODO this isnt included in AppConfig. I suspect it should be ?
