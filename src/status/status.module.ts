import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { ClusterModule } from '../cluster/cluster.module';
import { EntitiesModule } from '../entities/entities.module';
import { ConfigModule } from '../config/config.module';
import { StatusController } from './status.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HealthIndicatorService } from './health-indicator.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ClusterModule,
    EntitiesModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    TerminusModule,
  ],
  providers: [StatusService, HealthIndicatorService],
  controllers: [StatusController],
  exports: [HealthIndicatorService],
})
export class StatusModule {}
