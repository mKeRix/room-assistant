import { IsString } from 'class-validator';

import * as os from 'os';

export class GlobalConfig {
  @IsString()
  instanceName: string = os.hostname();
  @IsString({ each: true })
  integrations: string[] = [];
}
