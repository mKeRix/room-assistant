import { Module } from '@nestjs/common';
import c from 'config';
import { IntegrationsModule } from './integrations/integrations.module';
import { EntitiesModule } from './entities/entities.module';
import { ConfigModule } from './config/config.module';
import { ClusterModule } from './cluster/cluster.module';
import { ScheduleModule } from '@nestjs/schedule';
import _ from 'lodash';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

export const VERSION = require('../package.json').version;
export const CONFIGURED_INTEGRATIONS = c
  .get<string[]>('global.integrations')
  // lodash separates numbers in the case functions - we want them to stick together, hence we remove the dashes around numbers
  .map(id => _.kebabCase(id).replace(/-([1-9]+)-/, '$1'));

@Module({
  imports: [
    EntitiesModule,
    ConfigModule,
    ClusterModule,
    ScheduleModule.forRoot(),
    NestEmitterModule.forRoot(new EventEmitter()),
    IntegrationsModule.register(CONFIGURED_INTEGRATIONS)
  ]
})
export class AppModule {}
