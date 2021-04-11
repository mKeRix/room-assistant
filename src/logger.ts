import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { TransformableInfo } from 'logform';
import c from 'config';
import { LoggerConfig } from './config/logger.config';
import * as TransportStream from 'winston-transport';

const config = c.get<LoggerConfig>('logger');
const instanceName = c.get<string>('global.instanceName');
const missingDeps: string[] = [];

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
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ElasticsearchTransport = require('winston-elasticsearch')
      .ElasticsearchTransport;

    transports.push(
      new ElasticsearchTransport({
        indexPrefix: config.elasticsearch.indexPrefix,
        clientOpts: {
          node: config.elasticsearch.node,
          auth: config.elasticsearch.auth,
        },
      })
    );
  } catch (e) {
    missingDeps.push('elasticsearch');
  }
}

if (config.loki.enabled) {
  const lokiFormatter = winston.format((info) => {
    info.labels = info.labels || {};
    info.labels.context = info.context;
    info.labels.instanceName = info.instanceName;
    return info;
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const LokiTransport = require('winston-loki');

    transports.push(
      new LokiTransport({
        host: config.loki.host,
        labels: {
          job: 'room-assistant',
        },
        format: winston.format.combine(
          lokiFormatter(),
          winston.format.printf((info) => `${info.message}`)
        ),
      })
    );
  } catch (e) {
    missingDeps.push('loki');
  }
}

export const WINSTON_LOGGER = WinstonModule.createLogger({
  level: process.env.NODE_LOG_LEVEL || 'info',
  defaultMeta: {
    instanceName,
  },
  transports,
});

missingDeps.forEach((dep) => {
  WINSTON_LOGGER.error(
    `Logging with ${dep} was enabled, but the dependency is missing. Please install it with "npm install -g winston-${dep}".`,
    null,
    'LoggerService'
  );
});
