import { IClientOptions } from 'async-mqtt';
import * as jf from 'joiful';

export class MqttConfig {
  @(jf.string().required())
  mqttUrl = 'mqtt://localhost:1883';
  @(jf.object().required())
  mqttOptions: IClientOptions = {}; // TODO Not Validated
  @(jf.string().required())
  baseTopic = 'room-assistant/entity';
  @(jf.number().valid([0, 1, 2]).required())
  qos: 0 | 1 | 2 = 0;
  @(jf.boolean().required())
  retain = false;
}
