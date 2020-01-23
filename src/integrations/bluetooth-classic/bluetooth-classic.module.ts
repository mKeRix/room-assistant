import { DynamicModule, Module } from '@nestjs/common';
import { BluetoothClassicService } from './bluetooth-classic.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';
import { ClusterModule } from '../../cluster/cluster.module';

@Module({})
export default class BluetoothClassicModule {
  static forRoot(): DynamicModule {
    return {
      module: BluetoothClassicModule,
      imports: [ConfigModule, EntitiesModule, ClusterModule],
      providers: [BluetoothClassicService]
    };
  }
}
