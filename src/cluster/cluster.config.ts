import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
export class ClusterConfig {
  @IsString()
  @IsOptional()
  networkInterface?: string;
  @IsInt()
  @Min(0)
  @Max(65353)
  port = 6425;
  @IsInt()
  @Min(0)
  timeout = 60;
  @IsInt()
  @Min(0)
  @IsOptional()
  weight?: number;
  @IsInt()
  @Min(0)
  @IsOptional()
  quorum?: number;
  @IsBoolean()
  autoDiscovery = true;
  @IsString({ each: true })
  peerAddresses: string[] = [];
}
