import AppConfig from '../src/config/app.config';
import {BluetoothLowEnergyConfig} from '../src/integrations/bluetooth-low-energy/bluetooth-low-energy.config';
import {ClusterConfig} from '../src/cluster/cluster.config';
import {GlobalConfig} from '../src/config/global.config';
import {HomeAssistantConfig} from '../src/integrations/home-assistant/home-assistant.config';
import {OmronD6tConfig} from '../src/integrations/omron-d6t/omron-d6t.config';
import {GridEyeConfig} from '../src/integrations/grid-eye/grid-eye.config';

const config: AppConfig = {
    global: new GlobalConfig(),
    cluster: new ClusterConfig(),
    bluetoothLowEnergy: new BluetoothLowEnergyConfig(),
    omronD6t: new OmronD6tConfig(),
    gridEye: new GridEyeConfig(),
    homeAssistant: new HomeAssistantConfig(),
};

module.exports = config;
