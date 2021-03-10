import * as jf from 'joiful';

export class ClusterConfig {
  @(jf.string().optional())
  networkInterface?: string;
  @(jf.number().integer().min(0).max(65353).required())
  port = 6425;
  @(jf.number().integer().min(0).required())
  timeout = 60;
  @(jf.number().integer().min(0).optional())
  weight?: number;
  @(jf.number().integer().min(0).optional())
  quorum?: number;
  @(jf.boolean().required())
  autoDiscovery = true;
  @(jf.array({ elementClass: String }).required())
  peerAddresses: string[] = [];
}
