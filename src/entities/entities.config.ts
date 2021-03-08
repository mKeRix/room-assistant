import * as Joi from 'joi';
import * as jf from 'joiful';

export class RollingAverageOptions {
  @(jf.number().integer().min(1).required())
  window: number;
}
export class DebounceOptions {
  @(jf.number().min(0).optional())
  wait?: number;
  @(jf.number().min(0).optional())
  maxWait?: number;
  @(jf.boolean().optional())
  leading?: boolean;
  @(jf.boolean().optional())
  trailing?: boolean;
}

export class EntityBehavior {
  @(jf.object({ objectClass: DebounceOptions }).optional())
  debounce?: DebounceOptions;
  @(jf.object({ objectClass: RollingAverageOptions }).optional())
  rollingAverage?: RollingAverageOptions;
}

export class EntitiesConfig {
  @(jf.object().custom(validateBehaviours).required())
  behaviors: { [entityId: string]: EntityBehavior } = {};
}

// Custom validators as no decorator for "[key: string]: Type"
function validateBehaviours(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .object()
    .pattern(options.joi.string(), jf.getSchema(EntityBehavior));
}
