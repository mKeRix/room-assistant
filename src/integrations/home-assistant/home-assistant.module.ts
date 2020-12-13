import { DynamicModule, Module } from '@nestjs/common';
import { HomeAssistantService } from './home-assistant.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { StatusModule } from '../../status/status.module';
import { HomeAssistantHealthIndicator } from './home-assistant.health';

@Module({})
export default class HomeAssistantModule {
  static forRoot(): DynamicModule {
    return {
      module: HomeAssistantModule,
      imports: [ConfigModule, EntitiesModule, StatusModule],
      providers: [HomeAssistantService, HomeAssistantHealthIndicator],
    };
  }
}
