import { IsInstance, IsInt, Min } from 'class-validator';
import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';

export class GridEyeConfig {
  @IsInt()
  busNumber = 1;
  @IsInt()
  @Min(0)
  address = 0x69;
  @IsInt()
  @Min(0)
  deltaThreshold = 2;
  @IsInstance(HeatmapOptions)
  heatmap = new HeatmapOptions();
}
