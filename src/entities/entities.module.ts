import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { ClusterModule } from '../cluster/cluster.module';
import { EntitiesController } from './entities.controller';

@Module({
  imports: [ClusterModule],
  providers: [EntitiesService],
  controllers: [EntitiesController],
  exports: [EntitiesService],
})
export class EntitiesModule {}
