import { IClientOptions } from 'async-mqtt';

export class HomeAssistantConfig {
  mqttUrl = 'mqtt://localhost:1883';
  mqttOptions: IClientOptions = {};
  sendAttributes = true;
  sendMqttRoom = false;
  discoveryPrefix = 'homeassistant';
  mqttRoomPrefix = 'room-assistant/mqtt-room';
}
