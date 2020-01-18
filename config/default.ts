import AppConfig from '../src/config/app.config';
import {BluetoothLowEnergyConfig} from '../src/bluetooth-low-energy/bluetooth-low-energy.config';
import {ClusterConfig} from '../src/cluster/cluster.config';
import {GlobalConfig} from '../src/config/global.config';
import {HomeAssistantConfig} from '../src/home-assistant/home-assistant.config';
import {OmronD6tConfig} from '../src/omron-d6t/omron-d6t.config';

const config: AppConfig = {
    global: new GlobalConfig(),
    cluster: new ClusterConfig(),
    bluetoothLowEnergy: new BluetoothLowEnergyConfig(),
    omronD6t: new OmronD6tConfig(),
    homeAssistant: new HomeAssistantConfig(),
};

module.exports = config;
