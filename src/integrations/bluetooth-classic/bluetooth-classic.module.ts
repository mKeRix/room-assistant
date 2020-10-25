import { DynamicModule, Module } from '@nestjs/common';
import { BluetoothClassicService } from './bluetooth-classic.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { BluetoothModule } from '../bluetooth/bluetooth.module';

@Module({})
export default class BluetoothClassicModule {
  static forRoot(): DynamicModule {
    return {
      module: BluetoothClassicModule,
      imports: [BluetoothModule, ConfigModule, EntitiesModule, ClusterModule],
      providers: [BluetoothClassicService],
    };
  }
}
