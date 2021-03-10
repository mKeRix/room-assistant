import * as jf from 'joiful';

class ShellSwitchOptions {
  @(jf.string().required())
  name: string;
  @(jf.string().required())
  onCommand: string;
  @(jf.string().required())
  offCommand: string;
  @(jf.string().optional())
  icon?: string;
}

class ShellSensorOptions {
  @(jf.string().required())
  name: string;
  @(jf.string().required())
  command: string;
  @(jf.string().optional())
  regex?: string;
  @(jf.string().required())
  cron: string;
  @(jf.string().optional())
  icon?: string;
  @(jf.string().optional())
  unitOfMeasurement?: string;
  @(jf.string().optional())
  deviceClass?: string;
}
export class ShellConfig {
  @(jf.array({ elementClass: ShellSensorOptions }).required())
  sensors: ShellSensorOptions[] = [];
  @(jf.array({ elementClass: ShellSwitchOptions }).required())
  switches: ShellSwitchOptions[] = [];
}
