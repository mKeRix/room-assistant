import { DynamicModule, Module } from '@nestjs/common';
import { GpioService } from './gpio.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';

@Module({})
export default class GpioModule {
  static forRoot(): DynamicModule {
    return {
      module: GpioModule,
      imports: [ConfigModule, EntitiesModule],
      providers: [GpioService]
    };
  }
}
