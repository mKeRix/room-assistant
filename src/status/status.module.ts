import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { ClusterModule } from '../cluster/cluster.module';
import { EntitiesModule } from '../entities/entities.module';
import { ConfigModule } from '../config/config.module';
import { StatusController } from './status.controller';

@Module({
  imports: [ClusterModule, EntitiesModule, ConfigModule],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
