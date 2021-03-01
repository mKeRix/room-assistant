import { IClientOptions } from 'async-mqtt';
import * as jf from 'joiful';

export class HomeAssistantConfig {
  @(jf.string().required())
  mqttUrl = 'mqtt://localhost:1883';
  @(jf.object().required())
  mqttOptions: IClientOptions = {}; // TODO Not Validated
  @(jf.boolean().required())
  sendAttributes = true;

  sendMqttRoom = false;

  @(jf.string().required())
  discoveryPrefix = 'homeassistant';
  mqttRoomPrefix = 'room-assistant/mqtt-room';
}
