import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import c from 'config';
import { AppConfig } from './definitions/default';
import { delimiter } from 'path';

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(ConfigService.name);
  }

  /**
   * Lifecycle hook, called once the host module has been initialized.
   */
  onModuleInit(): void {
    const sources = c.util.getConfigSources().map(source => source.name);
    this.logger.log(`Loading configuration from ${sources.join(', ')}`);

    if (sources.length == 1) {
      const folders = process.env.NODE_CONFIG_DIR.split(delimiter).map(folder =>
        folder.startsWith('.') ? folder.replace('.', process.cwd()) : folder
      );
      folders.shift();
      this.logger.warn(`No configuration found in ${folders.join(', ')}`);
    }
  }

  /**
   * Retrieves the options for a key of the app configuration.
   *
   * @param setting - Top-level key of the app config
   * @returns Configuration for given key
   */
  get<T extends keyof AppConfig>(setting: T): AppConfig[T] {
    return c.get(setting);
  }
}
