import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { ClusterModule } from '../cluster/cluster.module';

@Module({
  imports: [ClusterModule],
  providers: [EntitiesService],
  exports: [EntitiesService]
})
export class EntitiesModule {}
