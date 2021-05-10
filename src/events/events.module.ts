import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EntitiesModule } from '../entities/entities.module';

@Module({
  imports: [EntitiesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
