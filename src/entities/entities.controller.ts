import { Controller, Get } from '@nestjs/common';
import { Entity } from './entity.dto';
import { EntitiesService } from './entities.service';
import { Camera } from './camera';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('entities')
@ApiExtraModels(Entity)
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all entities and their states',
    description:
      'The entities will always match the schema, but may also provide some additional information depending on the integration they are from. Note that camera entities are filtered from this list.',
  })
  @ApiOkResponse({
    description: 'All registered entities are listed.',
    content: {
      'application/json': {
        schema: { type: 'array', items: { $ref: getSchemaPath(Entity) } },
        example: [
          {
            id: 'example-sensor',
            name: 'Example Sensor',
            distributed: true,
            state: 'instance-name',
            attributes: {
              distance: 4.2,
            },
          },
          {
            id: 'example-switch',
            name: 'Example Switch',
            distributed: false,
            state: true,
            attributes: {},
          },
        ],
      },
    },
  })
  getAll(): Entity[] {
    return this.entitiesService
      .getAll()
      .filter((entity) => !(entity instanceof Camera));
  }
}
