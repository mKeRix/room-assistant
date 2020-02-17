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
    sensor.distances.get('room1').lastUpdatedAt = new Date(
      Date.now() - 61 * 1000
    );

    sensor.handleNewDistance('room2', 5);
    expect(sensor.state).toBe('room2');
    expect(sensor.attributes.distance).toBe(5);
  });

  it('should set the state to not_home if timeout has passed with no other measurements', () => {
    sensor.timeout = 15;
    sensor.handleNewDistance('room1', 1);
    sensor.distances.get('room1').lastUpdatedAt = new Date(
      Date.now() - 20 * 1000
    );

    sensor.updateState();
    expect(sensor.state).toBe(STATE_NOT_HOME);
    expect(sensor.attributes.distance).toBeUndefined();
  });

  it('should disable the timeout check if set to 0', () => {
    sensor.timeout = 0;
    sensor.handleNewDistance('room1', 3.3);
    sensor.distances.get('room1').lastUpdatedAt = new Date(
      Date.now() - 60 * 60 * 1000
    );

    sensor.updateState();
    expect(sensor.state).toBe('room1');
  });

  it('should not set the state to not_home if the timeout has not passed yet', () => {
    sensor.timeout = 30;
    sensor.handleNewDistance('room1', 1.2);
    sensor.distances.get('room1').lastUpdatedAt = new Date(
      Date.now() - 10 * 1000
    );

    sensor.updateState();
    expect(sensor.state).toBe('room1');
  });

  it('should switch to a closer instance if the device moves away from the current one', () => {
    sensor.handleNewDistance('room1', 5);
    sensor.handleNewDistance('room2', 6);
    sensor.handleNewDistance('room1', 7);

    expect(sensor.state).toBe('room2');
    expect(sensor.attributes.distance).toBe(6);
  });

  it('should switch to the next closest instance in range if current one goes out of range', () => {
    sensor.handleNewDistance('room1', 3);
    sensor.handleNewDistance('room2', 10);
    sensor.handleNewDistance('room1', 4, true);

    expect(sensor.state).toBe('room2');
    expect(sensor.attributes.distance).toBe(10);
  });

  it('should ignore old values when switching to a closer instance', () => {
    sensor.handleNewDistance('room1', 3);
    sensor.handleNewDistance('room2', 4);
    sensor.handleNewDistance('room3', 5);
    sensor.timeout = 10;
    sensor.distances.get('room2').lastUpdatedAt = new Date(
      Date.now() - 20 * 1000
    );
    sensor.handleNewDistance('room1', 7);

    expect(sensor.state).toBe('room3');
    expect(sensor.attributes.distance).toBe(5);
  });

  it('should switch to not_home if all instances go out of range', () => {
    sensor.handleNewDistance('room1', 3);
    sensor.handleNewDistance('room2', 10, true);
    sensor.handleNewDistance('room1', 10, true);

    expect(sensor.state).toBe(STATE_NOT_HOME);
    expect(sensor.attributes.distance).toBeUndefined();
  });

  it('should switch to not_home if all other distance values are too old', () => {
    sensor.handleNewDistance('room1', 3);
    sensor.handleNewDistance('room2', 4);
    sensor.timeout = 5;
    sensor.distances.get('room2').lastUpdatedAt = new Date(
      Date.now() - 10 * 1000
    );
    sensor.handleNewDistance('room1', 5, true);

    expect(sensor.state).toBe(STATE_NOT_HOME);
    expect(sensor.attributes.distance).toBeUndefined();
  });
});
