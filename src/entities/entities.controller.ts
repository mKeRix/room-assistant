import { Controller, Get } from '@nestjs/common';
import { Entity } from './entity';
import { EntitiesService } from './entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  getAll(): Entity[] {
    return this.entitiesService.getAll();
  }
}
