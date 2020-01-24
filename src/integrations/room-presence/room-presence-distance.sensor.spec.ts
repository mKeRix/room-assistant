import {
  RoomPresenceDistanceSensor,
  STATE_NOT_HOME
} from './room-presence-distance.sensor';

describe('RoomPresenceDistanceSensor', () => {
  let sensor: RoomPresenceDistanceSensor;

  beforeEach(() => {
    sensor = new RoomPresenceDistanceSensor('testid', 'Test', 0);
  });

  it('should update its state if it was undefined before', () => {
    sensor.handleNewDistance('room1', 1);
    expect(sensor.state).toBe('room1');
  });

  it('should update its state if the distance is closer', () => {
    sensor.handleNewDistance('room1', 10);
    sensor.handleNewDistance('room2', 1);

    expect(sensor.state).toBe('room2');
    expect(sensor.attributes.distance).toBe(1);
  });

  it('should ignore measurements that are further away', () => {
    sensor.handleNewDistance('room1', 0.5);
    sensor.handleNewDistance('room2', 1);

    expect(sensor.state).toBe('room1');
    expect(sensor.attributes.distance).toBe(0.5);
  });

  it('should update the attributes even if the room is the same', () => {
    sensor.handleNewDistance('room1', 1);
    sensor.handleNewDistance('room1', 10);

    expect(sensor.attributes.distance).toBe(10);
    expect(sensor.attributes.lastUpdatedAt).not.toBeUndefined();
  });

  it('should update the state with a further away measurement if timeout has passed', () => {
    sensor.timeout = 60;
    sensor.handleNewDistance('room1', 1);
    sensor.attributes.lastUpdatedAt = new Date(
      Date.now() - 61 * 1000
    ).toISOString();

    sensor.handleNewDistance('room2', 5);
    expect(sensor.state).toBe('room2');
    expect(sensor.attributes.distance).toBe(5);
  });

  it('should set the state to not_home if timeout has passed with no other measurements', () => {
    sensor.timeout = 15;
    sensor.handleNewDistance('room1', 1);
    sensor.attributes.lastUpdatedAt = new Date(
      Date.now() - 20 * 1000
    ).toISOString();

    sensor.checkForTimeout();
    expect(sensor.state).toBe(STATE_NOT_HOME);
    expect(sensor.attributes.distance).toBeUndefined();
  });

  it('should disable the timeout check if set to 0', () => {
    sensor.timeout = 0;
    sensor.handleNewDistance('room1', 3.3);
    sensor.attributes.lastUpdatedAt = new Date(
      Date.now() - 60 * 60 * 1000
    ).toISOString();

    sensor.checkForTimeout();
    expect(sensor.state).toBe('room1');
  });

  it('should not set the state to not_home if the timeout has not passed yet', () => {
    sensor.timeout = 30;
    sensor.handleNewDistance('room1', 1.2);
    sensor.attributes.lastUpdatedAt = new Date(
      Date.now() - 10 * 1000
    ).toISOString();

    sensor.checkForTimeout();
    expect(sensor.state).toBe('room1');
  });
});
