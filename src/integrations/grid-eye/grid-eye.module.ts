import { DynamicModule, Module } from '@nestjs/common';
import { GridEyeService } from './grid-eye.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export default class GridEyeModule {
  static forRoot(): DynamicModule {
    return {
      module: GridEyeModule,
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [GridEyeService]
    };
  }
}
