export class ClusterConfig {
  networkInterface?: string;
  port = 6425;
  timeout = 60;
  weight?: number;
  quorum?: number;
  autoDiscovery = true;
  peerAddresses: string[] = [];
}
