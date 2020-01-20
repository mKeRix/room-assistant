import { BluetoothLowEnergyConfig } from "../src/integrations/bluetooth-low-energy/bluetooth-low-energy.config";
import { ClusterConfig } from "../src/cluster/cluster.config";
import { GlobalConfig } from "../src/config/global.config";
import { HomeAssistantConfig } from "../src/integrations/home-assistant/home-assistant.config";
import { OmronD6tConfig } from "../src/integrations/omron-d6t/omron-d6t.config";
import { GridEyeConfig } from "../src/integrations/grid-eye/grid-eye.config";

export class AppConfig {
  global: GlobalConfig = new GlobalConfig();
  cluster: ClusterConfig = new ClusterConfig();
  bluetoothLowEnergy: BluetoothLowEnergyConfig = new BluetoothLowEnergyConfig();
  omronD6t: OmronD6tConfig = new OmronD6tConfig();
  gridEye: GridEyeConfig = new GridEyeConfig();
  homeAssistant: HomeAssistantConfig = new HomeAssistantConfig();
}

module.exports = new AppConfig();
