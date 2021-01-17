import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { TransformableInfo } from 'logform';
import c from 'config';
import { LoggerConfig } from './config/logger.config';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import * as TransportStream from 'winston-transport';

const config = c.get<LoggerConfig>('logger');
const instanceName = c.get<string>('global.instanceName');

const transports: TransportStream[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      process.stdout.isTTY
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.printf((info: TransformableInfo) => {
        return `${new Date(info.timestamp).toLocaleString()} - ${
          info.level
        } - ${info.context}: ${info.message}`;
      })
    ),
  }),
];

if (config.elasticsearch.enabled) {
  transports.push(
    new ElasticsearchTransport({
      indexPrefix: config.elasticsearch.indexPrefix,
      clientOpts: {
        node: config.elasticsearch.node,
        auth: config.elasticsearch.auth,
      },
    })
  );
}

export const WINSTON_LOGGER = WinstonModule.createLogger({
  level: process.env.NODE_LOG_LEVEL || 'info',
  defaultMeta: {
    instanceName,
  },
  transports,
});
