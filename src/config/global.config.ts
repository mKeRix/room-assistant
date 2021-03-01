import * as jf from 'joiful';
import * as os from 'os';

export class GlobalConfig {
  @(jf.string().required())
  instanceName: string = os.hostname();
  @(jf.array({ elementClass: String }).required())
  integrations: string[] = [];
}
