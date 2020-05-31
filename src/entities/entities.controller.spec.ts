import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { Sensor } from './sensor';
import { Switch } from './switch';
import { Entity } from './entity.dto';
import { NestEmitterModule } from 'nest-emitter';
import { ClusterModule } from '../cluster/cluster.module';
import { EventEmitter } from 'events';
import { ClusterService } from '../cluster/cluster.service';
import { ConfigModule } from '../config/config.module';
import { BinarySensor } from './binary-sensor';
import { Camera } from './camera';

describe('Entities Controller', () => {
  let controller: EntitiesController;
  let service: EntitiesService;
  const emitter: EventEmitter = new EventEmitter();
  const clusterService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestEmitterModule.forRoot(emitter),
        ClusterModule,
        ConfigModule,
      ],
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

    expect(controller.getAll()).toStrictEqual(entities);
  });

  it('should filter camera entities from the list', () => {
    const entities: Entity[] = [
      new BinarySensor('binary_sensor', 'Test Binary Sensor'),
      new Camera('camera', 'Test Camera'),
    ];
    jest.spyOn(service, 'getAll').mockImplementation(() => {
      return entities;
    });

    const result = controller.getAll();
    expect(result).toHaveLength(1);
    expect(result).toContain(entities[0]);
    expect(result).not.toContain(entities[1]);
  });
});
