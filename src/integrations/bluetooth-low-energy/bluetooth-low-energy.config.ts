import { randomInt } from "../../util/numbers";
import * as Joi from 'joi';
import * as jf from 'joiful';

class TagOverride {
  @(jf.string().optional())
  id?: string;
  @(jf.string().optional())
  name?: string;
  @(jf.number().negative().optional())
  measuredPower?: number;
  @(jf.number().integer().optional())
  batteryMask?: number;
}

export class BluetoothLowEnergyConfig {
  @(jf.number().integer().min(0))
  hciDeviceId = 0;
  @(jf.array({ elementClass: String }).optional())
  whitelist: string[] = [];
  @(jf.boolean().optional())
  whitelistRegex = false;
  @(jf.array({ elementClass: String }).optional())
  allowlist: string[] = [];
  @(jf.boolean().optional())
  allowlistRegex = false;
  @(jf.array({ elementClass: String }).optional())
  blacklist: string[] = [];
  @(jf.boolean().optional())
  blacklistRegex = false;
  @(jf.array({ elementClass: String }).optional())
  denylist: string[] = [];
  @(jf.boolean().required())
  denylistRegex = false;
  @(jf.boolean().required())
  processIBeacon = true;
  @(jf.boolean().required())
  onlyIBeacon = false;
  @(jf.number().integer().min(0).max(0xffff).required())
  majorMask = 0xffff;
  @(jf.number().integer().min(0).max(0xffff).required())
  minorMask = 0xffff;
  @(jf.number().integer().required())
  batteryMask = 0x00000000;

  instanceBeaconEnabled = true;
  instanceBeaconMajor = 1;
  instanceBeaconMinor = randomInt(0, 65535);

  @(jf.object().custom(validateTagOverrides).required())
  tagOverrides: { [entityId: string]: TagOverride } = {};
  @(jf.number().integer().min(0))
  timeout = 60;
  @(jf.number().integer().min(0))
  updateFrequency = 0;
  @(jf.number().positive().optional())
  maxDistance?: number;
}
// TODO OR Properties(whitelist|allowlist)

const BluetoothLowEnergyScheme = jf
  .getSchema(BluetoothLowEnergyConfig)
  .without('whitelist', 'allowlist')
  .without('whitelistRegEx', 'allowlistRegEx');

function validateTagOverrides(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .object()
    .pattern(options.joi.string(), jf.getSchema(TagOverride));
}
