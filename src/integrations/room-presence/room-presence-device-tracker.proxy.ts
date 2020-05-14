import {
  RoomPresenceDistanceSensor,
  STATE_NOT_HOME,
} from './room-presence-distance.sensor';
import { DeviceTracker } from '../../entities/device-tracker';

export class RoomPresenceDeviceTrackerProxyHandler
  implements ProxyHandler<RoomPresenceDistanceSensor> {
  constructor(private readonly deviceTracker: DeviceTracker) {}

  set(target: RoomPresenceDistanceSensor, p: PropertyKey, value: any): boolean {
    target[p] = value;

    if (p === 'state') {
      this.deviceTracker.state = value != STATE_NOT_HOME;
    }

    return true;
  }
}
