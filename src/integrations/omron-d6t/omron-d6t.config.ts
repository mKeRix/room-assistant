import { HeatmapOptions } from '../thermopile/thermopile-occupancy.config';
import * as jf from 'joiful';

export class OmronD6tConfig {
  @(jf.number().integer().min(0).required())
  busNumber = 1;
  @(jf.number().integer().min(0).required())
  address = 0x0a;
  @(jf.number().min(0).required())
  deltaThreshold = 1.5;
  @(jf.object({ objectClass: HeatmapOptions }).required())
  heatmap = new HeatmapOptions();
}
