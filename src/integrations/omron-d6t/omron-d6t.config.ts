import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';

export class OmronD6tConfig {
  busNumber = 1;
  address = 0x0a;
  deltaThreshold = 1.5;
  heatmap = new HeatmapOptions();
}
