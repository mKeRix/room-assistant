import { mqttScheme, MQTTOptionConfig } from '../mqtt/mqtt.config';
import * as jf from 'joiful';

export class HomeAssistantConfig {
  @(jf.string().uri(mqttScheme).required())
  mqttUrl = 'mqtt://localhost:1883';
  @(jf.object().required())
  mqttOptions: MQTTOptionConfig = new MQTTOptionConfig();
  @(jf.boolean().required())
  sendAttributes = true;
  @(jf.boolean().required())
  sendMqttRoom = false;
  @(jf.string().required())
  discoveryPrefix = 'homeassistant';
  @(jf.string().required())
  mqttRoomPrefix = 'room-assistant/mqtt-room';
}
