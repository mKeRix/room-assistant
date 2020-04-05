const mockExec = jest.fn();

import { ShellSwitch } from './shell.switch';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  promisify: () => mockExec
}));

describe('ShellSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the onCommand when turned on', async () => {
    const onCommand = 'echo on';
    const shellSwitch = new ShellSwitch('test', 'Test', onCommand, 'echo off');
    await shellSwitch.turnOn();

    expect(mockExec).toHaveBeenCalledWith(onCommand);
    expect(shellSwitch.state).toBeTruthy();
  });

  it('should execute the offCommand when turned off', async () => {
    const offCommand = 'echo off';
    const shellSwitch = new ShellSwitch('test', 'Test', 'echo on', offCommand);
    await shellSwitch.turnOff();

    expect(mockExec).toHaveBeenCalledWith(offCommand);
    expect(shellSwitch.state).toBeFalsy();
  });

  it('should not switch the state if command execution fails', async () => {
    mockExec.mockRejectedValue(new Error('command failed'));

    const shellSwitch = new ShellSwitch('test', 'Test', 'echo on', 'echo off');
    shellSwitch.state = false;
    await shellSwitch.turnOn();

    expect(shellSwitch.state).toBeFalsy();
  });
});
