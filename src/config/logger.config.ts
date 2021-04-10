import { ApiKeyAuth, BasicAuth } from '@elastic/elasticsearch/lib/pool';
import * as Joi from 'joi';
import * as jf from 'joiful';

class IdKeyPair {
  @(jf.string().required())
  id: string;
  @(jf.string().required())
  api_key: string;
}

class ApiKeyAuthConfig implements ApiKeyAuth {
  @(jf.any().custom(validateApiKey).required())
  apiKey: string | IdKeyPair;
}

class BasicAuthConfig implements BasicAuth {
  @(jf.string().required())
  username: string;
  @(jf.string().required())
  password: string;
}

class ElasticsearchConfig {
  @(jf.boolean().required())
  enabled = false;
  @(jf.string().required())
  node = 'http://localhost:9200';
  @(jf.any().custom(validateAuthType).optional())
  auth?: BasicAuthConfig | ApiKeyAuthConfig;
  @(jf.string().required())
  indexPrefix = 'room-assistant';
}

class LokiConfig {
  @(jf.boolean().required())
  enabled = false;
  @(jf
    .string()
    .uri({ scheme: ['http', 'https'] })
    .required())
  host = 'http://localhost:3100';
}

export class LoggerConfig {
  @(jf.object({ objectClass: ElasticsearchConfig }).required())
  elasticsearch = new ElasticsearchConfig();
  @(jf.object({ objectClass: LokiConfig }).required())
  loki = new LokiConfig();
}

// Custom validators as no decorator for "key: Type1|Type2"
function validateAuthType(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .alternatives()
    .try(jf.getSchema(BasicAuthConfig), jf.getSchema(ApiKeyAuthConfig));
}

function validateApiKey(options: {
  schema: Joi.Schema;
  joi: typeof Joi;
}): Joi.Schema {
  return options.joi
    .alternatives()
    .try(options.joi.string(), jf.getSchema(IdKeyPair));
}
