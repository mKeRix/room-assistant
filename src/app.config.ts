import { BluetoothLowEnergyConfig } from './integrations/bluetooth-low-energy/bluetooth-low-energy.config';
import { ClusterConfig } from './cluster/cluster.config';
import { GlobalConfig } from './config/global.config';
import { HomeAssistantConfig } from './integrations/home-assistant/home-assistant.config';
import { OmronD6tConfig } from './integrations/omron-d6t/omron-d6t.config';
import { GridEyeConfig } from './integrations/grid-eye/grid-eye.config';
import { BluetoothClassicConfig } from './integrations/bluetooth-classic/bluetooth-classic.config';
import { GpioConfig } from './integrations/gpio/gpio.config';
import { ShellConfig } from './integrations/shell/shell.config';
import { XiaomiMiConfig } from './integrations/xiaomi-mi/xiaomi-mi.config';
import { EntitiesConfig } from './entities/entities.config';
import { LoggerConfig } from './config/logger.config';
import { MqttConfig } from './integrations/mqtt/mqtt.config';
import * as jf from 'joiful';

export class AppConfig {
  @(jf.object().required())
  global: GlobalConfig = new GlobalConfig();
  @(jf.object().required())
  logger: LoggerConfig = new LoggerConfig();
  @(jf.object().required())
  cluster: ClusterConfig = new ClusterConfig();
  @(jf.object().required())
  entities: EntitiesConfig = new EntitiesConfig();
  @(jf.object().required())
  bluetoothLowEnergy: BluetoothLowEnergyConfig = new BluetoothLowEnergyConfig();
  @(jf.object().required())
  bluetoothClassic: BluetoothClassicConfig = new BluetoothClassicConfig();
  @(jf.object().required())
  omronD6t: OmronD6tConfig = new OmronD6tConfig();
  @(jf.object().required())
  gridEye: GridEyeConfig = new GridEyeConfig();
  @(jf.object().required())
  gpio: GpioConfig = new GpioConfig();
  @(jf.object().required())
  shell: ShellConfig = new ShellConfig();
  @(jf.object().required())
  xiaomiMi: XiaomiMiConfig = new XiaomiMiConfig();
  @(jf.object().required())
  homeAssistant: HomeAssistantConfig = new HomeAssistantConfig();
  @(jf.object().required())
  mqtt: MqttConfig = new MqttConfig();
}
