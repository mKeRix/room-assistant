import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { Sensor } from './sensor';
import { Switch } from './switch';
import { Entity } from './entity';
import { NestEmitterModule } from 'nest-emitter';
import { ClusterModule } from '../cluster/cluster.module';
import { EventEmitter } from 'events';
import { ClusterService } from '../cluster/cluster.service';

describe('Entities Controller', () => {
  let controller: EntitiesController;
  let service: EntitiesService;
  const emitter: EventEmitter = new EventEmitter();
  const clusterService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(emitter), ClusterModule],
      controllers: [EntitiesController],
      providers: [EntitiesService],
    })
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    controller = module.get<EntitiesController>(EntitiesController);
    service = module.get<EntitiesService>(EntitiesService);
  });

  it('should return all registered entities', () => {
    const entities: Entity[] = [
      new Sensor('sensor', 'Test Sensor'),
      new Switch('switch', 'Test Switch'),
    ];
    jest.spyOn(service, 'getAll').mockImplementation(() => {
      return entities;
    });

    expect(controller.getAll()).toBe(entities);
  });
});
