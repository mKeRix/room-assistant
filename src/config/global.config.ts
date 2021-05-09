import * as jf from 'joiful';
import * as os from 'os';
import { readdirSync } from 'fs';
import _ from 'lodash';
import path from 'path';

const availableIntegrations = readdirSync(
  path.join(__dirname, '..', 'integrations'),
  { withFileTypes: true }
)
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .map((dir) => _.camelCase(dir))
  .map((key) => key.replace(/[0-9][A-Z]/, (match) => match.toLowerCase())); // make chars after digits lowercase

export class GlobalConfig {
  @(jf.string().required())
  instanceName: string = os.hostname();
  @(jf
    .array()
    .items((joi) => joi.string().valid(...availableIntegrations))
    .required())
  integrations: string[] = [];
  @(jf.number().integer().min(0).max(65353).required())
  apiPort = 6415;
}
