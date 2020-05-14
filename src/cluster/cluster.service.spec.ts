const mockBrowser = {
  on: jest.fn(),
  start: jest.fn(),
};
const mockAdvertisement = {
  start: jest.fn(),
};
const mockMdns = {
  udp: jest.fn().mockImplementation((name: string) => {
    return { name };
  }),
  createBrowser: jest.fn().mockReturnValue(mockBrowser),
  createAdvertisement: jest.fn().mockReturnValue(mockAdvertisement),
  rst: {
    DNSServiceResolve: jest.fn(),
    DNSServiceGetAddrInfo: jest.fn(),
    getaddrinfo: jest.fn(),
    makeAddressesUnique: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/camelcase
  dns_sd: [],
};

import { networkInterfaces } from 'os';
import Democracy, { Node } from 'democracy';
import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { ConfigModule } from '../config/config.module';
import { ClusterConfig } from './cluster.config';
import { ConfigService } from '../config/config.service';
import c from 'config';

jest.mock('os');
jest.mock('democracy');
jest.mock('mdns', () => mockMdns, { virtual: true });

describe('ClusterService', () => {
  let service: ClusterService;
  const mockConfig = new ClusterConfig();
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      return key === 'cluster' ? mockConfig : c.get(key);
    }),
  };

  beforeAll(async () => {
    (networkInterfaces as jest.Mock).mockReturnValue({
      lo: [
        {
          address: '127.0.0.1',
          family: 'IPv4',
          internal: true,
        },
      ],
      eth0: [
        {
          address: '192.168.1.108',
          family: 'IPv4',
          internal: false,
        },
        {
          address: 'fe80::a00:27ff:fe4e:66a1',
          family: 'IPv6',
          internal: false,
        },
      ],
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ClusterService],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();

    service = module.get<ClusterService>(ClusterService);
  });

  it('should determine the local IP', () => {
    expect(Democracy).toHaveBeenCalledWith({
      id: 'test-instance',
      source: '192.168.1.108:6425',
      peers: [],
      timeout: 60000,
      weight: undefined,
    });
  });

  it('should start advertising room-assistant via Bonjour', () => {
    service.onApplicationBootstrap();
    expect(mockMdns.createAdvertisement).toHaveBeenCalledWith(
      { name: 'room-assistant' },
      6425,
      {
        networkInterface: undefined,
      }
    );
    expect(mockMdns.createBrowser).toHaveBeenCalledWith(
      { name: 'room-assistant' },
      expect.anything()
    );
    expect(mockBrowser.start).toHaveBeenCalled();
    expect(mockAdvertisement.start).toHaveBeenCalled();
  });

  it('should not advertise the instance if auto discovery has been turned off', () => {
    mockConfig.autoDiscovery = false;

    service.onApplicationBootstrap();
    expect(mockMdns.createAdvertisement).not.toHaveBeenCalled();
    expect(mockMdns.createBrowser).not.toHaveBeenCalled();
  });

  it('should ignore the quorum if it is not configured', () => {
    jest.spyOn(service, 'nodes').mockReturnValue({
      abc: {
        state: 'leader',
      } as Node,
    });

    expect(service.quorumReached()).toBeTruthy();
  });

  it('should consider the quorum reached if as many nodes are connected', () => {
    jest.spyOn(service, 'nodes').mockReturnValue({
      abc: {
        state: 'leader',
      } as Node,
      def: {
        state: 'citizen',
      } as Node,
    });
    mockConfig.quorum = 2;

    expect(service.quorumReached()).toBeTruthy();
  });

  it('should not consider the quorum reached if less nodes are connected', () => {
    jest.spyOn(service, 'nodes').mockReturnValue({
      abc: {
        state: 'leader',
      } as Node,
    });
    mockConfig.quorum = 2;

    expect(service.quorumReached()).toBeFalsy();
  });

  it('should not consider removed nodes for the quorum', () => {
    jest.spyOn(service, 'nodes').mockReturnValue({
      abc: {
        state: 'removed',
      } as Node,
      def: {
        state: 'leader',
      } as Node,
    });
    mockConfig.quorum = 2;

    expect(service.quorumReached()).toBeFalsy();
  });

  it('should be the majority leader if the quorum is reached', () => {
    jest.spyOn(service, 'quorumReached').mockReturnValue(true);
    jest.spyOn(service, 'isLeader').mockReturnValue(true);

    expect(service.isMajorityLeader()).toBeTruthy();
  });

  it('should not be the majority leader if the quorum is not reached', () => {
    jest.spyOn(service, 'quorumReached').mockReturnValue(false);
    jest.spyOn(service, 'isLeader').mockReturnValue(true);

    expect(service.isMajorityLeader()).toBeFalsy();
  });
});
