import { RotationOption } from './thermopile-occupancy.service';
import * as jf from 'joiful';

export class HeatmapOptions {
  @(jf.boolean().required())
  enabled = true;
  @(jf.number().required())
  minTemperature = 16;
  @(jf.number().required())
  maxTemperature = 30;
  @(jf.number().valid(RotationOption).required())
  rotation: number = RotationOption[0];
  @(jf.boolean().required())
  drawTemperatures = true;
}
