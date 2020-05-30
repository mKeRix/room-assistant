import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';

export class GridEyeConfig {
  busNumber = 1;
  address = 0x69;
  deltaThreshold = 2;
  heatmap = new HeatmapOptions();
}
