export = {
  ready: jest.fn(),
  stopping: jest.fn(),
  watchdogInterval: jest.fn().mockReturnValue(0),
  watchdog: jest.fn(),
};
