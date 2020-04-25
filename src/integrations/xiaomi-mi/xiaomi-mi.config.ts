export class XiaomiMiConfig {
  hciDeviceId = 0;
  sensors: XiaomiMiSensorOptions[] = [];

  timeout = 5;
}

class XiaomiMiSensorOptions {
  name: string;
  address: string;
}
