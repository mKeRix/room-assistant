import { IClientOptions } from 'async-mqtt';
import { IsString, IsBoolean, Allow } from 'class-validator';

export class HomeAssistantConfig {
  @IsString()
  mqttUrl = 'mqtt://localhost:1883';
  @Allow() // TODO: Need to look into nesting
  mqttOptions: IClientOptions = {};
  @IsBoolean()
  sendAttributes = true;
  sendMqttRoom = false;
  discoveryPrefix = 'homeassistant';
  mqttRoomPrefix = 'room-assistant/mqtt-room';
}
