import { DynamicModule, Module } from '@nestjs/common';
import { HomeAssistantService } from './home-assistant.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { StatusModule } from '../../status/status.module';
import { HomeAssistantHealthIndicator } from './home-assistant.health';
import { ClusterModule } from '../../cluster/cluster.module';

@Module({})
export default class HomeAssistantModule {
  static forRoot(): DynamicModule {
    return {
      module: HomeAssistantModule,
      imports: [ConfigModule, EntitiesModule, ClusterModule, StatusModule],
      providers: [HomeAssistantService, HomeAssistantHealthIndicator],
    };
  }
}
