import { IClientOptions } from 'async-mqtt';

export class HomeAssistantConfig {
  mqttUrl: string = 'mqtt://localhost:1883';
  mqttOptions: IClientOptions = {};
}
