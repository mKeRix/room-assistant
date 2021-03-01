import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';
import * as jf from 'joiful';

export class GridEyeConfig {
  @(jf.number().integer().required())
  busNumber = 1;
  @(jf.number().integer().min(0).required())
  address = 0x69;
  @(jf.number().min(0).required())
  deltaThreshold = 2;
  @(jf.object({ objectClass: HeatmapOptions }).required())
  heatmap = new HeatmapOptions();
}
