import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesService } from './entities.service';
import { PublishersService } from '../publishers/publishers.service';
import { PublishersModule } from '../publishers/publishers.module';
import { Sensor } from './sensor.entity';
import * as util from 'util';
import { ClusterService } from '../cluster/cluster.service';

describe('EntitiesService', () => {
  let service: EntitiesService;
  const publishersService = {
    publishNewEntity: () => undefined,
    publishNewState: () => undefined,
    publishNewAttributes: () => undefined
  };
  const clusterService = {
    isLeader: () => true
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublishersModule],
      providers: [EntitiesService]
    })
      .overrideProvider(PublishersService)
      .useValue(publishersService)
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<EntitiesService>(EntitiesService);
  });

  it('should return information about whether entity ids are registered or not', () => {
    const entity = new Sensor('test_sensor', 'Test Sensor');
    service.add(entity);

    expect(service.has('test_sensor')).toBeTruthy();
    expect(service.has('random_sensor')).toBeFalsy();
  });

  it('should return added sensors as proxies', () => {
    const entity = new Sensor('example', 'Example Sensor');
    const returnedEntity = service.add(entity);

    expect(util.types.isProxy(returnedEntity)).toBeTruthy();
  });

  it('should throw an exception when adding a sensor with an existing id', () => {
    const entity = new Sensor('duplicate_sensor', 'Duplicate');
    service.add(entity);

    expect(() => service.add(entity)).toThrow(Error);
  });

  it('should announce new entities to publishers', () => {
    const entity = new Sensor('vip_sensor', 'VIP');
    const spy = jest.spyOn(publishersService, 'publishNewEntity');

    service.add(entity);
    expect(spy).toHaveBeenCalledWith(entity);
  });

  it('should get sensor objects by id', () => {
    const id = '123_sensor';
    const entity = new Sensor(id, 'Numbers Sensor');
    service.add(entity);

    const returnedEntity = service.get(id);
    expect(util.types.isProxy(returnedEntity)).toBeTruthy();
    expect(returnedEntity.id).toBe(id);
    expect(returnedEntity).toBeInstanceOf(Sensor);
  });

  it('should return undefined for non-existent entities', () => {
    expect(service.get('ghost_entity')).toBeUndefined();
  });

  it('should send state updates to publishers', () => {
    const entity = new Sensor('test_sensor', 'Test Sensor');
    const spy = jest.spyOn(publishersService, 'publishNewState');

    const entityProxy = service.add(entity);
    entityProxy.state = 1337;
    expect(spy).toHaveBeenCalledWith('test_sensor', 1337, false);
  });

  it('should send attribute updates to publishers', () => {
    const entity = new Sensor('attributes_sensor', 'Sensor with attributes');
    const spy = jest.spyOn(publishersService, 'publishNewAttributes');

    const entityProxy = service.add(entity);
    entityProxy.attributes.test = '123';
    expect(spy).toHaveBeenCalledWith(
      'attributes_sensor',
      { test: '123' },
      false
    );
  });

  it('should pass distributed information to publishers', () => {
    const entity = new Sensor('distributed_sensor', 'Distribution', true);
    const stateSpy = jest.spyOn(publishersService, 'publishNewState');
    const attributesSpy = jest.spyOn(publishersService, 'publishNewAttributes');

    const entityProxy = service.add(entity);
    entityProxy.state = 'test';
    entityProxy.attributes.tested = true;
    expect(stateSpy).toHaveBeenCalledWith('distributed_sensor', 'test', true);
    expect(attributesSpy).toHaveBeenCalledWith(
      'distributed_sensor',
      { tested: true },
      true
    );
  });
});
