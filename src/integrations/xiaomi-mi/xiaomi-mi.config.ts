import * as Joi from 'joi';
import * as jf from 'joiful';

const MAC_REGEXP = new RegExp('^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$');
const MAC_ERROR = '{#label} does not match the required MAC address format';

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

function validateMACAddress(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi.string().pattern(MAC_REGEXP).message(MAC_ERROR);
}
