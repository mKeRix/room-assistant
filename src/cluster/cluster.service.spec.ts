const mockBrowser = {
  on: jest.fn(),
  start: jest.fn()
};
const mockAdvertisement = {
  start: jest.fn()
};

import { networkInterfaces } from 'os';
import Democracy from 'democracy';
import * as mdns from 'mdns';
import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { ConfigModule } from '../config/config.module';

jest.mock('os');
jest.mock('democracy');
jest.mock(
  'mdns',
  () => {
    return {
      udp: jest.fn().mockImplementation((name: string) => {
        return { name };
      }),
      createBrowser: jest.fn().mockReturnValue(mockBrowser),
      createAdvertisement: jest.fn().mockReturnValue(mockAdvertisement),
      rst: {
        DNSServiceResolve: jest.fn(),
        DNSServiceGetAddrInfo: jest.fn(),
        getaddrinfo: jest.fn(),
        makeAddressesUnique: jest.fn()
      },
      dns_sd: []
    };
  },
  { virtual: true }
);

describe('ClusterService', () => {
  let service: ClusterService;

  beforeAll(async () => {
    (networkInterfaces as jest.Mock).mockReturnValue({
      lo: [
        {
          address: '127.0.0.1',
          family: 'IPv4',
          internal: true
        }
      ],
      eth0: [
        {
          address: '192.168.1.108',
          family: 'IPv4',
          internal: false
        },
        {
          address: 'fe80::a00:27ff:fe4e:66a1',
          family: 'IPv6',
          internal: false
        }
      ]
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ClusterService]
    }).compile();

    service = module.get<ClusterService>(ClusterService);
  });

  it('should determine the local IP', () => {
    expect(Democracy).toHaveBeenCalledWith({
      source: '192.168.1.108:6425',
      peers: []
    });
  });

  it('should start advertising room-assistant via Bonjour', async () => {
    await service.onApplicationBootstrap();
    expect(mdns.createAdvertisement).toHaveBeenCalledWith(
      { name: 'room-assistant' },
      6425,
      {
        networkInterface: undefined
      }
    );
    expect(mdns.createBrowser).toHaveBeenCalledWith(
      { name: 'room-assistant' },
      expect.anything()
    );
    expect(mockBrowser.start).toHaveBeenCalled();
    expect(mockAdvertisement.start).toHaveBeenCalled();
  });
});
