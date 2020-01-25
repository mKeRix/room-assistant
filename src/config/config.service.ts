import { Injectable } from '@nestjs/common';
import c from 'config';
import { AppConfig } from './definitions/default';

@Injectable()
export class ConfigService {
  get<T extends keyof AppConfig>(setting: T): AppConfig[T] {
    return c.get(setting);
  }
}
