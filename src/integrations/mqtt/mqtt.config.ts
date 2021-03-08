import { IClientOptions } from 'async-mqtt';
import * as jf from 'joiful';

export const mqttScheme = {
  scheme: ['mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss'],
};

export class MQTTOptionConfig implements IClientOptions {
  @(jf.string().optional())
  username?: string;
  @(jf.string().optional())
  password?: string;
  @(jf.boolean().required())
  rejectUnauthorized?: boolean = true;
}
export class MqttConfig {
  @(jf.string().uri(mqttScheme).required())
  mqttUrl = 'mqtt://localhost:1883';
  @(jf.object().required())
  mqttOptions: MQTTOptionConfig = new MQTTOptionConfig();
  @(jf.string().required())
  baseTopic = 'room-assistant/entity';
  @(jf.number().valid([0, 1, 2]).required())
  qos: 0 | 1 | 2 = 0;
  @(jf.boolean().required())
  retain = false;
}
