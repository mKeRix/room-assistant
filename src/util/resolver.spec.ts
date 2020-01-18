import { Type } from '@nestjs/common';
import { HomeAssistantService } from '../home-assistant/home-assistant.service';
import { BluetoothLowEnergyModule } from '../bluetooth-low-energy/bluetooth-low-energy.module';
import { resolveClasses } from './resolver';

const CLASSES: { [key: string]: Type<any> } = {
  homeAssistant: HomeAssistantService,
  bluetoothLowEnergy: BluetoothLowEnergyModule
};

describe('ResolverUtil', () => {
  it('should return a list of class references based on the given shortnames', () => {
    expect(resolveClasses(['homeAssistant'], CLASSES)).toStrictEqual([
      HomeAssistantService
    ]);
    expect(
      resolveClasses(['homeAssistant', 'bluetoothLowEnergy'], CLASSES)
    ).toStrictEqual([HomeAssistantService, BluetoothLowEnergyModule]);
  });

  it('should ignore invalid shortnames', () => {
    expect(resolveClasses(['invalid'], CLASSES)).toHaveLength(0);
    expect(
      resolveClasses(['bluetoothLowEnergy', 'invalid'], CLASSES)
    ).toStrictEqual([BluetoothLowEnergyModule]);
  });
});
