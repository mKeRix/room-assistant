import { RoomPresenceDistanceSensor } from './room-presence-distance.sensor';
import { DeviceTracker } from '../../entities/device-tracker';
import { Sensor } from '../../entities/sensor';
import { RoomPresenceProxyHandler } from './room-presence.proxy';

describe('RoomPresenceProxyHandler', () => {
  let proxy: RoomPresenceDistanceSensor;
  let deviceTracker: DeviceTracker;
  let batterySensor: Sensor;
  let sensor: RoomPresenceDistanceSensor;

  beforeEach(() => {
    deviceTracker = new DeviceTracker('test-tracker', 'Test Tracker');
    batterySensor = new Sensor('test-battery', 'Test Battery');

    sensor = new RoomPresenceDistanceSensor('test-sensor', 'Test Sensor', 0);
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

  it('should set the battery level to value', () => {
    const sensorProxy = new Proxy<RoomPresenceDistanceSensor>(
      sensor,
      new RoomPresenceProxyHandler(deviceTracker, batterySensor)
    );

    sensorProxy['batteryLevel'] = 99;

    expect(batterySensor.state).toBe(99);
  });
});
