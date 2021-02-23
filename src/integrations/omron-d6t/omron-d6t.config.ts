import { IsInstance, IsInt, IsNumber, Min } from 'class-validator';
import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';

export class OmronD6tConfig {
  @IsInt()
  @Min(0)
  busNumber = 1;
  @IsInt()
  @Min(0)
  address = 0x0a;
  @IsNumber()
  @Min(0)
  deltaThreshold = 1.5;
  @IsInstance(HeatmapOptions)
  heatmap = new HeatmapOptions();
}
