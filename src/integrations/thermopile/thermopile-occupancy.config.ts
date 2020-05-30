import { RotationOption } from './thermopile-occupancy.service';

export class HeatmapOptions {
  minTemperature = 16;
  maxTemperature = 30;
  rotation: RotationOption = 0;
  drawTemperatures = true;
}
