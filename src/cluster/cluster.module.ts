import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [ClusterService],
  exports: [ClusterService]
})
export class ClusterModule {}
