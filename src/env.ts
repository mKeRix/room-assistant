import { delimiter } from 'path';

process.env.NODE_CONFIG_DIR = `${__dirname}/config/definitions/${delimiter}${
  process.env.NODE_CONFIG_DIR || './config/'
}`;
