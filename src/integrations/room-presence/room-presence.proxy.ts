import {
  RoomPresenceDistanceSensor,
  STATE_NOT_HOME,
} from './room-presence-distance.sensor';
import { DeviceTracker } from '../../entities/device-tracker';
import { Sensor } from '../../entities/sensor';

export class RoomPresenceProxyHandler
  implements ProxyHandler<RoomPresenceDistanceSensor> {
  constructor(
    private readonly deviceTracker: DeviceTracker,
    private readonly batterySensor?: Sensor
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: RoomPresenceDistanceSensor, p: PropertyKey, value: any): boolean {
    target[p] = value;

    switch (p) {
      case 'state':
        this.deviceTracker.state = value != STATE_NOT_HOME;
        break;
      case 'batteryLevel':
        this.batterySensor.state = value;
        break;
    }

    return true;
  }
}
