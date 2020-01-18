import * as os from 'os';

export class GlobalConfig {
  instanceName: string = os.hostname();
  publishers: string[] = [];
  integrations: string[] = [];
}
