import { Module } from '@nestjs/common';
import { BluetoothService } from './bluetooth.service';
import { BluetoothHealthIndicator } from './bluetooth.health';
import { ConfigModule } from '../../config/config.module';
import { StatusModule } from '../../status/status.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule, StatusModule, ScheduleModule.forRoot()],
  providers: [BluetoothService, BluetoothHealthIndicator],
  exports: [BluetoothService],
})
export class BluetoothModule {}
