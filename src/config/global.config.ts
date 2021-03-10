import * as jf from 'joiful';
import * as os from 'os';

const Integrations = [
  'bluetoothLowEnergy',
  'bluetoothClassic',
  'omronD6t',
  'gridEye',
  'gpio',
  'shell',
  'xiaomiMi',
  'homeAssistant',
  'mqtt',
];

export class GlobalConfig {
  @(jf.string().required())
  instanceName: string = os.hostname();
  @(jf
    .array()
    .items((joi) => joi.string().valid(...Integrations))
    .required())
  integrations: string[] = [];
}
