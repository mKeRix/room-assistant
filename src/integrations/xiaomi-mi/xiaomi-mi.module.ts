import './env';
import { DynamicModule, Module } from '@nestjs/common';
import { XiaomiMiService } from './xiaomi-mi.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { BluetoothModule } from '../bluetooth/bluetooth.module';

@Module({})
export default class XiaomiMiModule {
  static forRoot(): DynamicModule {
    return {
      module: XiaomiMiModule,
      imports: [BluetoothModule, EntitiesModule, ConfigModule],
      providers: [XiaomiMiService],
    };
  }
}
