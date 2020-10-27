import { RoomPresenceDistanceSensor } from './room-presence-distance.sensor';
import { DeviceTracker } from '../../entities/device-tracker';
import { RoomPresenceProxyHandler } from './room-presence.proxy';

describe('RoomPresenceProxyHandler', () => {
  let proxy: RoomPresenceDistanceSensor;
  let deviceTracker: DeviceTracker;

  beforeEach(() => {
    deviceTracker = new DeviceTracker('test-tracker', 'Test Tracker');

    const sensor = new RoomPresenceDistanceSensor(
      'test-sensor',
      'Test Sensor',
      0
    );
    proxy = new Proxy<RoomPresenceDistanceSensor>(
      sensor,
      new RoomPresenceProxyHandler(deviceTracker)
    );
  });

  it('should set the device tracker to true when home', () => {
    proxy.handleNewDistance('room1', 0.5);

    expect(deviceTracker.state).toBeTruthy();
  });

  it('should set the device tracker to false when not home', () => {
    proxy.updateState();

    expect(deviceTracker.state).toBeFalsy();
  });
});
