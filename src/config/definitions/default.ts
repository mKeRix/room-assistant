import { BluetoothLowEnergyConfig } from '../../integrations/bluetooth-low-energy/bluetooth-low-energy.config';
import { ClusterConfig } from '../../cluster/cluster.config';
import { GlobalConfig } from '../global.config';
import { HomeAssistantConfig } from '../../integrations/home-assistant/home-assistant.config';
import { OmronD6tConfig } from '../../integrations/omron-d6t/omron-d6t.config';
import { GridEyeConfig } from '../../integrations/grid-eye/grid-eye.config';
import { BluetoothClassicConfig } from '../../integrations/bluetooth-classic/bluetooth-classic.config';
import { GpioConfig } from '../../integrations/gpio/gpio.config';
import { ShellConfig } from '../../integrations/shell/shell.config';
import { XiaomiMiConfig } from '../../integrations/xiaomi-mi/xiaomi-mi.config';
import { EntitiesConfig } from '../../entities/entities.config';
import { LoggerConfig } from '../logger.config';
import { MqttConfig } from "../../integrations/mqtt/mqtt.config";

export class AppConfig {
  global: GlobalConfig = new GlobalConfig();
  logger: LoggerConfig = new LoggerConfig();
  cluster: ClusterConfig = new ClusterConfig();
  entities: EntitiesConfig = new EntitiesConfig();
  bluetoothLowEnergy: BluetoothLowEnergyConfig = new BluetoothLowEnergyConfig();
  bluetoothClassic: BluetoothClassicConfig = new BluetoothClassicConfig();
  omronD6t: OmronD6tConfig = new OmronD6tConfig();
  gridEye: GridEyeConfig = new GridEyeConfig();
  gpio: GpioConfig = new GpioConfig();
  shell: ShellConfig = new ShellConfig();
  xiaomiMi: XiaomiMiConfig = new XiaomiMiConfig();
  homeAssistant: HomeAssistantConfig = new HomeAssistantConfig();
  mqtt: MqttConfig = new MqttConfig();
}

module.exports = new AppConfig();
