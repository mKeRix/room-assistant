import { RoomPresenceDistanceSensor } from './room-presence-distance.sensor';
import { DeviceTracker } from '../../entities/device-tracker';
import { RoomPresenceDeviceTrackerProxyHandler } from './room-presence-device-tracker.proxy';

describe('RoomPresenceDeviceTrackerProxyHandler', () => {
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
      new RoomPresenceDeviceTrackerProxyHandler(deviceTracker)
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
