/* eslint @typescript-eslint/no-var-requires: "off" */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import c from 'config';
const appConfigDefaults = require('./definitions/default');
import { AppConfig } from './definitions/default';
import { delimiter } from 'path';
import { validateSync, ValidationError } from 'class-validator';

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

    // Validate config for each of the integrations / services
    const appConfig = (c as unknown) as AppConfig;
    let errors: ValidationError[];
    for (const [integration, intConfig] of Object.entries(appConfig)) {
      if (integration in appConfigDefaults)
        errors = validateSync(intConfig, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });
      else
        errors = [
          {
            property: integration,
            constraints: {
              unknownProperty:
                'Property is not defined in the configuration schema',
            },
            children: [],
          },
        ];

      for (const error of errors) this.logValidationError(integration, error);

      // if (errors) process.exit(1);
    }
  }

  /**
   * Format and log configuration errors.
   *
   * @param integration - Top-level key of the app config
   * @param errors - Array of validation errors
   */
  private logValidationError(
    integration: string,
    error: ValidationError
  ): void {
    let message = `Error in ${integration} with property "${error.property}"`;

    if (error.constraints)
      message += ` failing validation ${JSON.stringify(error.constraints)}.`;

    if (error?.children?.[0]) {
      message += ` due to child properties.`;
      for (const child of error.children)
        message += ` Error due to property "${
          child.property
        }" failing validation ${JSON.stringify(child.constraints)}.`;
    }

    this.logger.error(message);
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
