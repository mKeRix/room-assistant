import { IClientOptions } from "async-mqtt";

export class MqttConfig {
  mqttUrl = 'mqtt://localhost:1883';
  mqttOptions: IClientOptions = {};
  baseTopic = 'room-assistant/entity';
  qos: 0 | 1 | 2 = 0;
  retain = false;
}
