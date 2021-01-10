import { Module } from '@nestjs/common';
import { BluetoothService } from './bluetooth.service';
import { BluetoothHealthIndicator } from './bluetooth.health';
import { ConfigModule } from '../../config/config.module';
import { StatusModule } from '../../status/status.module';
import { ScheduleModule } from '@nestjs/schedule';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [ConfigModule, StatusModule, ScheduleModule.forRoot()],
  providers: [
    BluetoothService,
    BluetoothHealthIndicator,
    makeCounterProvider({
      name: 'bluetooth_le_advertisements_received_count',
      help:
        'Number of Bluetooth Low Energy advertisements that were detected by this device',
    }),
  ],
  exports: [BluetoothService],
})
export class BluetoothModule {}
