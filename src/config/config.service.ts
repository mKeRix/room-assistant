import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import c from 'config';
import { AppConfig } from '../app.config';
import { delimiter } from 'path';
import * as jf from 'joiful';

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
    const sources = c.util.getConfigSources().map((source) => source.name);
    this.logger.log(
      `Loading configuration from ${sources.join(
        ', '
      )} (Current: ${process.cwd()})`
    );

    if (sources.length == 1) {
      const folders = process.env.NODE_CONFIG_DIR.split(
        delimiter
      ).map((folder) =>
        folder.startsWith('.') ? folder.replace('.', process.cwd()) : folder
      );
      folders.shift();
      this.logger.warn(`No configuration found in ${folders.join(', ')}`);
    }

    this.validateConfig(c as Partial<AppConfig>);
  }

  /**
   * Validates the union of default and user configuration parameters. The parser will
   * not abort on first error but will highlight all errors detected. Validation is done
   * strictly without conversion of types. An error message is generated on validation failure.
   *
   * @param cfg - configuration object to validate
   */
  validateConfig(cfg: Partial<AppConfig>): void {
    const results = jf.validateAsClass(cfg, AppConfig, {
      abortEarly: false,
      convert: false,
    });

    results?.error?.details.forEach((detail) => {
      let msg = `${detail.message} [Value: ${JSON.stringify(
        detail?.context?.value
      )}].`;
      msg += detail?.context?.message
        ? ` Additional Context: ${JSON.stringify(detail.context.message)}`
        : '';
      this.logger.error(msg);
    });
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
