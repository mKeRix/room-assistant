import { DynamicModule, Module } from '@nestjs/common';
import { OmronD6tService } from './omron-d6t.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export default class OmronD6tModule {
  static forRoot(): DynamicModule {
    return {
      module: OmronD6tModule,
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [OmronD6tService],
    };
  }
}
