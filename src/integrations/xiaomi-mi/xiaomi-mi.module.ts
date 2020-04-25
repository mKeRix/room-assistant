import { DynamicModule, Module } from '@nestjs/common';
import { XiaomiMiService } from './xiaomi-mi.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export default class XiaomiMiModule {
  static forRoot(): DynamicModule {
    return {
      module: XiaomiMiModule,
      imports: [EntitiesModule, ConfigModule, ScheduleModule.forRoot()],
      providers: [XiaomiMiService]
    };
  }
}
