export class ShellConfig {
  sensors: ShellSensorOptions[] = [];
  switches: ShellSwitchOptions[] = [];
}

class ShellSensorOptions {
  name: string;
  command: string;
  regex?: string;
  cron: string;
  icon?: string;
  unitOfMeasurement?: string;
  deviceClass?: string;
}

class ShellSwitchOptions {
  name: string;
  onCommand: string;
  offCommand: string;
  icon?: string;
}
