export class XiaomiMiConfig {
  hciDeviceId = 0;
  sensors: XiaomiMiSensorOptions[] = [];
}

export class XiaomiMiSensorOptions {
  name: string;
  address: string;
  bindKey?: string;
}
