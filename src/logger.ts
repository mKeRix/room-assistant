import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { TransformableInfo } from 'logform';

export const WINSTON_LOGGER = WinstonModule.createLogger({
  level: process.env.NODE_LOG_LEVEL || 'info',
  transports: [
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
  ],
});
