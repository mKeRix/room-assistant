import { Module, Provider, Type } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { HomeAssistantService } from '../home-assistant/home-assistant.service';
import { PUBLISHER_SERVICES } from './publishers.constants';
import { ConfigModule } from '../config/config.module';
import { ClusterModule } from '../cluster/cluster.module';
import { resolveClasses } from '../util/resolver';
import c from 'config';

export const CONFIGURED_PUBLISHERS = c.get<string[]>('global.publishers');
export const PUBLISHER_MAPPING: { [key: string]: Type<any> } = {
  homeAssistant: HomeAssistantService
};

@Module({
  imports: [ClusterModule, ConfigModule],
  providers: [
    ...resolveClasses(CONFIGURED_PUBLISHERS, PUBLISHER_MAPPING),
    {
      provide: PUBLISHER_SERVICES,
      useFactory: (...args) => args,
      inject: [...resolveClasses(CONFIGURED_PUBLISHERS, PUBLISHER_MAPPING)]
    },
    PublishersService
  ],
  exports: [PublishersService]
})
export class PublishersModule {}
