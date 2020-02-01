export class ShellConfig {
  sensors: ShellSensorOptions[] = [];
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
