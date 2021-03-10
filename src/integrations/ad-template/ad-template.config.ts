export class AdTemplateConfig {
  devices: AdTemplateDeviceOptions[] = [];
}

export class AdTemplateDeviceOptions {
  address: string;
  name: string;
  helpers: string[];
  sensors: AdTemplateSensorOptions[];
}

export class AdTemplateSensorOptions {
  name: string;
  state: string;
  deviceClass?: string;
  unitOfMeasurement?: string;
  icon?: string;
}
