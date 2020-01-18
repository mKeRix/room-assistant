import { Module, Type } from '@nestjs/common';
import { BluetoothLowEnergyModule } from './bluetooth-low-energy/bluetooth-low-energy.module';
import c from 'config';
import { resolveClasses } from './util/resolver';
import { OmronD6tModule } from './omron-d6t/omron-d6t.module';

export const CONFIGURED_INTEGRATIONS = c.get<string[]>('global.integrations');
export const INTEGRATION_MAPPING: { [key: string]: Type<any> } = {
  bluetoothLowEnergy: BluetoothLowEnergyModule,
  omronD6t: OmronD6tModule
};

@Module({
  imports: [
    ...resolveClasses(CONFIGURED_INTEGRATIONS, INTEGRATION_MAPPING),
    OmronD6tModule
  ]
})
export class AppModule {}
