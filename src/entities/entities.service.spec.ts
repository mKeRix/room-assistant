import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesService } from './entities.service';
import { Sensor } from './sensor';
import * as util from 'util';
import { ClusterService } from '../cluster/cluster.service';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { EntityCustomization } from './entity-customization.interface';
import { SensorConfig } from '../integrations/home-assistant/sensor-config';
import { ClusterModule } from '../cluster/cluster.module';

describe('EntitiesService', () => {
  let service: EntitiesService;
  const emitter: EventEmitter = new EventEmitter();
  const clusterService = {
    isMajorityLeader: jest.fn(),
    on: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestEmitterModule.forRoot(emitter), ClusterModule],
      providers: [EntitiesService]
    })
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<EntitiesService>(EntitiesService);
    jest.resetAllMocks();
  });

  it('should register a callback to leader election on bootstrap', () => {
    service.onApplicationBootstrap();
    expect(clusterService.on).toHaveBeenCalled();
  });

  it('should refresh entity states if elected', () => {
    const refreshSpy = jest
      .spyOn(service, 'refreshStates')
      .mockImplementation(() => undefined);

    service.onApplicationBootstrap();
    const electedCallback = clusterService.on.mock.calls[0][1].bind(service);
    electedCallback();

    expect(refreshSpy).toHaveBeenCalled();
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
    const spy = jest.spyOn(emitter, 'emit');

    service.add(entity);
    expect(spy).toHaveBeenCalledWith('newEntity', entity, undefined);
  });

  it('should include entity customizations with new entities', () => {
    const entity = new Sensor('customized_sensor', 'custom');
    const customizations: Array<EntityCustomization<any>> = [
      {
        for: SensorConfig,
        overrides: {
          icon: 'mdi:test'
        }
      }
    ];
    const spy = jest.spyOn(emitter, 'emit');

    service.add(entity, customizations);
    expect(spy).toHaveBeenCalledWith('newEntity', entity, customizations);
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
    const spy = jest.spyOn(emitter, 'emit');

    const entityProxy = service.add(entity);
    entityProxy.state = 1337;
    expect(spy).toHaveBeenCalledWith('stateUpdate', 'test_sensor', 1337, false);
  });

  it('should send attribute updates to publishers', () => {
    const entity = new Sensor('attributes_sensor', 'Sensor with attributes');
    const spy = jest.spyOn(emitter, 'emit');

    const entityProxy = service.add(entity);
    entityProxy.attributes.test = '123';
    expect(spy).toHaveBeenCalledWith(
      'attributesUpdate',
      'attributes_sensor',
      { test: '123' },
      false
    );
  });

  it('should pass distributed information to publishers', () => {
    const entity = new Sensor('distributed_sensor', 'Distribution', true);
    const spy = jest.spyOn(emitter, 'emit');
    clusterService.isMajorityLeader.mockReturnValue(true);

    const entityProxy = service.add(entity);
    entityProxy.state = 'test';
    entityProxy.attributes.tested = true;
    expect(spy).toHaveBeenCalledWith(
      'stateUpdate',
      'distributed_sensor',
      'test',
      true
    );
    expect(spy).toHaveBeenCalledWith(
      'attributesUpdate',
      'distributed_sensor',
      { tested: true },
      true
    );
  });

  it('should not emit updates for distributed sensors if not the leader', () => {
    const entity = new Sensor('distributed_sensor', 'Distribution', true);
    const spy = jest.spyOn(emitter, 'emit');
    clusterService.isMajorityLeader.mockReturnValue(false);

    const entityProxy = service.add(entity);
    entityProxy.state = true;
    entityProxy.attributes.awesome = 'yes';
    expect(spy).not.toHaveBeenCalledWith(
      'stateUpdate',
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
    expect(spy).not.toHaveBeenCalledWith(
      'attributesUpdate',
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
  });

  it('should send out events for all non-distributed entities when refreshing as non-leader', () => {
    clusterService.isMajorityLeader.mockReturnValue(false);
    const spy = jest.spyOn(emitter, 'emit');

    const sensor1 = new Sensor('sensor1', 'Sensor 1');
    sensor1.state = 1;
    sensor1.attributes = {
      test: 'abc'
    };
    service.add(sensor1);
    const sensor2 = new Sensor('sensor2', 'Sensor 2', true);
    sensor2.state = 2;
    service.add(sensor2);
    spy.mockClear();

    service.refreshStates();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should send out events for all entities when refreshing as majority leader', () => {
    clusterService.isMajorityLeader.mockReturnValue(true);
    const spy = jest.spyOn(emitter, 'emit');

    const sensor1 = new Sensor('sensor1', 'Sensor 1');
    sensor1.state = 1;
    sensor1.attributes = {
      test: 'abc'
    };
    service.add(sensor1);
    const sensor2 = new Sensor('sensor2', 'Sensor 2', true);
    sensor2.state = 2;
    service.add(sensor2);
    spy.mockClear();

    service.refreshStates();

    expect(spy).toHaveBeenCalledTimes(4);
  });
});
