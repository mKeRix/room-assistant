import { IClientOptions } from 'async-mqtt';

export class HomeAssistantConfig {
  mqttUrl = 'mqtt://localhost:1883';
  mqttOptions: IClientOptions = {};
  sendAttributes = true;
  discoveryPrefix = 'homeassistant';
}
