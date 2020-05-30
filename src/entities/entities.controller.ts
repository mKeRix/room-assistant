import { Controller, Get } from '@nestjs/common';
import { Entity } from './entity';
import { EntitiesService } from './entities.service';
import { Camera } from './camera';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  getAll(): Entity[] {
    return this.entitiesService
      .getAll()
      .filter((entity) => !(entity instanceof Camera));
  }
}
