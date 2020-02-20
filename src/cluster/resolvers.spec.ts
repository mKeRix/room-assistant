const mockExec = jest.fn();

import { getAddrInfoDig } from './resolvers';
import { Service } from 'mdns';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  promisify: () => mockExec
}));

describe('resolvers', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should return a single address correctly', done => {
    const service: Service = {
      addresses: undefined,
      flags: undefined,
      fullname: undefined,
      host: undefined,
      interfaceIndex: undefined,
      networkInterface: undefined,
      port: undefined,
      replyDomain: undefined,
      type: undefined
    };
    mockExec.mockResolvedValue({ stdout: '192.168.1.20\n' });

    getAddrInfoDig(service, () => {
      try {
        expect(service.addresses).toStrictEqual(['192.168.1.20']);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should resolve multiple addresses correctly', done => {
    const service: Service = {
      addresses: undefined,
      flags: undefined,
      fullname: undefined,
      host: undefined,
      interfaceIndex: undefined,
      networkInterface: undefined,
      port: undefined,
      replyDomain: undefined,
      type: undefined
    };
    mockExec.mockResolvedValue({ stdout: '192.168.1.20\n192.168.1.21\n' });

    getAddrInfoDig(service, () => {
      try {
        expect(service.addresses).toStrictEqual([
          '192.168.1.20',
          '192.168.1.21'
        ]);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should pass errors to the callback', done => {
    const service: Service = {
      addresses: undefined,
      flags: undefined,
      fullname: undefined,
      host: undefined,
      interfaceIndex: undefined,
      networkInterface: undefined,
      port: undefined,
      replyDomain: undefined,
      type: undefined
    };
    mockExec.mockRejectedValue({ stdout: 'dig not found' });

    getAddrInfoDig(service, e => {
      try {
        expect(e).not.toBeUndefined();
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
