import './env';
import { DynamicModule, Module } from '@nestjs/common';
import { AdTemplateService } from './ad-template.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { BluetoothModule } from '../bluetooth/bluetooth.module';

@Module({})
export default class AdTemplateModule {
  static forRoot(): DynamicModule {
    return {
      module: AdTemplateModule,
      imports: [BluetoothModule, EntitiesModule, ConfigModule],
      providers: [AdTemplateService],
    };
  }
}
