export class ClusterConfig {
  networkInterface?: string;
  port: number = 6425;
  peerAddresses: string[] = [];
}
