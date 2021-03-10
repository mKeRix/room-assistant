import * as Joi from 'joi';
import * as jf from 'joiful';

const MAC_REXEP_STRING = '^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$';
const MAC_REGEXP = new RegExp(MAC_REXEP_STRING);
const MAC_DEFAULT_REGEXP = new RegExp(MAC_REXEP_STRING + '|default');
const MAC_ERROR = '{#label} does not match the required MAC address format';

class BluetoothClassicEntityOverride {
  @(jf.string().optional())
  id?: string;
}

export class BluetoothClassicConfig {
  @(jf.array({ elementClass: String }).custom(validateMACAddress).required())
  addresses: string[] = [];
  @(jf.any().custom(validateMinRSSI).optional())
  minRssi?: number | { [macAddress: string]: number };
  @(jf.number().integer().min(0).required())
  hciDeviceId = 0;
  @(jf.number().min(1).required())
  interval = 10;
  @(jf.number().min(1).required())
  scanTimeLimit = 6;
  @(jf.number().min(1).required())
  timeoutCycles = 2;
  @(jf.boolean().required())
  preserveState = false;
  @(jf.boolean().required())
  inquireFromStart = true;
  @(jf.object().custom(validateEntityOverrides).required())
  entityOverrides: { [entityId: string]: BluetoothClassicEntityOverride } = {};
}

function validateMACAddress(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .array()
    .items(options.joi.string().pattern(MAC_REGEXP).message(MAC_ERROR));
}

function validateMinRSSI(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .alternatives()
    .try(
      options.joi.number().max(0),
      options.joi
        .object()
        .pattern(
          options.joi.string().pattern(MAC_DEFAULT_REGEXP),
          options.joi.number().max(0)
        )
    );
}

function validateEntityOverrides(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .object()
    .pattern(
      options.joi.string(),
      jf.getSchema(BluetoothClassicEntityOverride)
    );
}
