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

import { ValidateNested } from 'class-validator';
export class AppConfig {
  @ValidateNested()
  global: GlobalConfig = new GlobalConfig();
  @ValidateNested()
  logger: LoggerConfig = new LoggerConfig();
  @ValidateNested()
  cluster: ClusterConfig = new ClusterConfig();
  @ValidateNested()
  entities: EntitiesConfig = new EntitiesConfig();
  @ValidateNested()
  bluetoothLowEnergy: BluetoothLowEnergyConfig = new BluetoothLowEnergyConfig();
  @ValidateNested()
  bluetoothClassic: BluetoothClassicConfig = new BluetoothClassicConfig();
  @ValidateNested()
  omronD6t: OmronD6tConfig = new OmronD6tConfig();
  @ValidateNested()
  gridEye: GridEyeConfig = new GridEyeConfig();
  @ValidateNested()
  gpio: GpioConfig = new GpioConfig();
  @ValidateNested()
  shell: ShellConfig = new ShellConfig();
  @ValidateNested()
  xiaomiMi: XiaomiMiConfig = new XiaomiMiConfig();
  @ValidateNested()
  homeAssistant: HomeAssistantConfig = new HomeAssistantConfig();
  mqtt: MqttConfig = new MqttConfig();
}

module.exports = new AppConfig();
