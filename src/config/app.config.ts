import { GlobalConfig } from './global.config';
import { ClusterConfig } from '../cluster/cluster.config';
import { BluetoothLowEnergyConfig } from '../integrations/bluetooth-low-energy/bluetooth-low-energy.config';
import { HomeAssistantConfig } from '../integrations/home-assistant/home-assistant.config';
import { OmronD6tConfig } from '../integrations/omron-d6t/omron-d6t.config';

export default interface AppConfig {
  global: GlobalConfig;
  cluster: ClusterConfig;
  bluetoothLowEnergy: BluetoothLowEnergyConfig;
  omronD6t: OmronD6tConfig;
  homeAssistant: HomeAssistantConfig;
}
