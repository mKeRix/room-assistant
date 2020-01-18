import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';

@Module({
  providers: [EntitiesService],
  exports: [EntitiesService]
})
export class EntitiesModule {}
