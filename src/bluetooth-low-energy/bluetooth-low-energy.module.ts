import { Module } from '@nestjs/common';
import { BluetoothLowEnergyService } from './bluetooth-low-energy.service';
import { EntitiesModule } from '../entities/entities.module';
import { ConfigModule } from '../config/config.module';
import { ClusterModule } from '../cluster/cluster.module';
import { BluetoothLowEnergyDistributedService } from './bluetooth-low-energy-distributed.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EntitiesModule,
    ConfigModule,
    ClusterModule,
    ScheduleModule.forRoot()
  ],
  providers: [BluetoothLowEnergyService, BluetoothLowEnergyDistributedService]
})
export class BluetoothLowEnergyModule {}
