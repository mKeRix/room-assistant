import * as os from 'os';

export class GlobalConfig {
  instanceName: string = os.hostname();
  integrations: string[] = [];
}
