import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common';
import Democracy, { Node } from 'democracy';
import { Advertisement, Browser, Service } from 'mdns';
import _ from 'lodash';
import * as os from 'os';
import { NetworkInterfaceInfo } from 'os';
import { ConfigService } from '../config/config.service';
import { ClusterConfig } from './cluster.config';

let mdns;
try {
  mdns = require('mdns');
} catch (e) {
  mdns = undefined;
}

@Injectable()
export class ClusterService extends Democracy
  implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly configService: ConfigService;
  private readonly config: ClusterConfig;
  private readonly logger: Logger;

  private advertisement: Advertisement;
  private browser: Browser;
  private networkInterfaces: NetworkInterfaceInfo[];

  constructor(configService: ConfigService) {
    const config = configService.get('cluster');

    const networkInterfaces = _.flatMap<NetworkInterfaceInfo>(
      config.networkInterface
        ? os.networkInterfaces()[config.networkInterface]
        : os.networkInterfaces()
    );
    const ip = networkInterfaces.find(
      address => address.internal === false && address.family === 'IPv4'
    ).address;
    super({
      source: `${ip}:${config.port}`,
      peers: Array.from(config.peerAddresses),
      timeout: config.timeout * 1000,
      weight: config.weight
    });

    this.networkInterfaces = networkInterfaces;
    this.configService = configService;
    this.config = config;
    this.logger = new Logger(ClusterService.name);
  }

  onApplicationBootstrap(): any {
    if (this.config.autoDiscovery) {
      if (mdns !== undefined) {
        this.startBonjourDiscovery();
      } else {
        this.logger.warn(
          'Dependency "mdns" was not found, automatic discovery has been disabled. You will have to provide the addresses of other room-assistant nodes manually in the config.'
        );
      }
    }

    this.on('added', this.handleNodeAdded);
    this.on('removed', this.handleNodeRemoved);
    this.on('elected', this.handleNodeElected);
  }

  onApplicationShutdown(): any {
    this.advertisement?.stop();
    this.browser?.stop();
  }

  protected startBonjourDiscovery(): void {
    this.advertisement = mdns.createAdvertisement(
      mdns.udp('room-assistant'),
      this.config.port,
      {
        networkInterface: this.config.networkInterface
      }
    );
    const sequence = [
      mdns.rst.DNSServiceResolve(),
      'DNSServiceGetAddrInfo' in mdns.dns_sd
        ? mdns.rst.DNSServiceGetAddrInfo()
        : mdns.rst.getaddrinfo({ families: [0] }),
      mdns.rst.makeAddressesUnique()
    ];
    this.browser = mdns.createBrowser(mdns.udp('room-assistant'), {
      resolverSequence: sequence
    });
    this.browser.on('serviceUp', this.handleNodeDiscovery.bind(this));
    this.browser.on('error', e => {
      this.logger.error(e.message, e.trace);
    });

    this.logger.log('Starting mDNS advertisements and discovery');
    this.advertisement.start();
    this.browser.start();
  }

  private handleNodeDiscovery(service: Service): void {
    const ownIps = this.networkInterfaces.map(info => info.address);
    if (
      _.some(service.addresses, address => ownIps.includes(address)) ||
      _.some(this.options.peers, peer =>
        service.addresses.some(
          address => peer[0] === address && peer[1] === service.port.toString()
        )
      )
    ) {
      return;
    }

    this.options.peers.push([service.addresses[0], service.port.toString()]);
    this.hello();
  }

  private handleNodeAdded(node: Node): void {
    this.logger.log(`Added ${node.source} to the cluster with id ${node.id}`);
  }

  private handleNodeRemoved(node: Node): void {
    this.logger.log(
      `Removed ${node.source} from the cluster with id ${node.id}`
    );
  }

  private handleNodeElected(node: Node): void {
    this.logger.log(`${node.id} has been elected as leader`);
  }
}
