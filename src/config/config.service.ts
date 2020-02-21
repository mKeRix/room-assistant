import { Injectable } from '@nestjs/common';
import c from 'config';
import { AppConfig } from './definitions/default';

@Injectable()
export class ConfigService {
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
