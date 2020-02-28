import './env';
import { DynamicModule, Module } from '@nestjs/common';
import { BluetoothLowEnergyService } from './bluetooth-low-energy.service';
import { EntitiesModule } from '../../entities/entities.module';
import { ConfigModule } from '../../config/config.module';
import { ClusterModule } from '../../cluster/cluster.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export default class BluetoothLowEnergyModule {
  static forRoot(): DynamicModule {
    return {
      module: BluetoothLowEnergyModule,
      imports: [
        EntitiesModule,
        ConfigModule,
        ClusterModule,
        ScheduleModule.forRoot()
      ],
      providers: [BluetoothLowEnergyService]
    };
  }
}
