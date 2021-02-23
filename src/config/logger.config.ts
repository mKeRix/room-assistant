import { ApiKeyAuth, BasicAuth } from '@elastic/elasticsearch/lib/pool';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ElasticsearchConfig {
  @IsBoolean()
  enabled = false;
  @IsString() // TODO: URL validator does not include port
  node = 'http://localhost:9200';
  @IsObject() // TODO: Explore "OR" capability
  @IsOptional()
  auth?: BasicAuth | ApiKeyAuth;
  @IsString()
  indexPrefix = 'room-assistant';
}
export class LoggerConfig {
  @ValidateNested()
  elasticsearch = new ElasticsearchConfig();
}
