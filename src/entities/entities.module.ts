import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { PublishersModule } from '../publishers/publishers.module';

@Module({
  imports: [PublishersModule],
  providers: [EntitiesService],
  exports: [EntitiesService]
})
export class EntitiesModule {}
