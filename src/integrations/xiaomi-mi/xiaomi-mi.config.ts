import * as jf from 'joiful';

export class XiaomiMiSensorOptions {
  @(jf.string().required())
  name: string;
  @(jf.string().hex().exactLength(12).required())
  address: string;
  @(jf.string().hex().optional())
  bindKey?: string;
}

export class XiaomiMiConfig {
  @(jf.number().integer().min(0).required())
  hciDeviceId = 0;
  @(jf.array({ elementClass: XiaomiMiSensorOptions }).required())
  sensors: XiaomiMiSensorOptions[] = [];
}
