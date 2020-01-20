import { networkInterfaces } from 'os';
import Democracy from 'democracy';
import * as mdns from 'mdns';
import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { ConfigModule } from '../config/config.module';

jest.mock('os');
jest.mock('democracy');
jest.mock('mdns');

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

  it('should start advertising room-assistant via Bonjour', () => {
    (mdns.udp as jest.Mock).mockImplementation((name: string) => {
      return { name };
    });

    const browser = {
      on: jest.fn(),
      start: jest.fn()
    };
    (mdns.createBrowser as jest.Mock).mockReturnValue(browser);
    const advertisement = {
      start: jest.fn()
    };
    (mdns.createAdvertisement as jest.Mock).mockReturnValue(advertisement);

    service.onApplicationBootstrap();
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
    expect(browser.start).toHaveBeenCalled();
    expect(advertisement.start).toHaveBeenCalled();
  });
});
