import { ApiKeyAuth, BasicAuth } from '@elastic/elasticsearch/lib/pool';

export class LoggerConfig {
  elasticsearch = new ElasticsearchConfig();
}

class ElasticsearchConfig {
  enabled = false;
  node = 'http://localhost:9200';
  auth?: BasicAuth | ApiKeyAuth;
  indexPrefix = 'room-assistant';
}
