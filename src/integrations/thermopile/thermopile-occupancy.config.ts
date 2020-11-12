import { RotationOption } from './thermopile-occupancy.service';

export class HeatmapOptions {
  enabled = true;
  minTemperature = 16;
  maxTemperature = 30;
  rotation: RotationOption = 0;
  drawTemperatures = true;
}
