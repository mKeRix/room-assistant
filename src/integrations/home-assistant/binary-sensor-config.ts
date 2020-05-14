import { EntityConfig } from './entity-config';

export class BinarySensorConfig extends EntityConfig {
  payloadOn = 'true';
  payloadOff = 'false';
  deviceClass?: BinarySensorDeviceClass;

  constructor(id: string, name: string) {
    super('binary_sensor', id, name);
  }
}

export enum BinarySensorDeviceClass {
  BATTERY = 'battery',
  COLD = 'cold',
  CONNECTIVITY = 'connectivity',
  DOOR = 'door',
  GARAGE_DOOR = 'garage_door',
  GAS = 'gas',
  HEAT = 'heat',
  LIGHT = 'light',
  LOCK = 'lock',
  MOISTURE = 'moisture',
  MOTION = 'motion',
  MOVING = 'moving',
  OCCUPANCY = 'occupancy',
  OPENING = 'opening',
  PLUG = 'plug',
  POWER = 'power',
  PRESENCE = 'presence',
  PROBLEM = 'problem',
  SAFETY = 'safety',
  SMOKE = 'smoke',
  SOUND = 'sound',
  VIBRATION = 'vibration',
  WINDOW = 'window',
}
