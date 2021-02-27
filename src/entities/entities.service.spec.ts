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
import { Switch } from './switch';
import { ConfigModule } from '../config/config.module';

jest.mock('mdns', () => ({}), { virtual: true });

describe('EntitiesService', () => {
  let service: EntitiesService;
  const emitter: EventEmitter = new EventEmitter();
  const clusterService = {
    isMajorityLeader: jest.fn(),
    on: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useRealTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestEmitterModule.forRoot(emitter),
        ClusterModule,
        ConfigModule,
      ],
      providers: [EntitiesService],
    })
      .overrideProvider(ClusterService)
      .useValue(clusterService)
      .compile();

    service = module.get<EntitiesService>(EntitiesService);
  });

  describe('Entity Registry', () => {
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

    it("should proxify object properties", () => {
      const entity = new Sensor('example', 'Example Sensor');
      const returnedEntity = service.add(entity);

      returnedEntity.attributes.object = {};

      expect(util.types.isProxy(returnedEntity.attributes.object)).toBeTruthy();
    });

    it("should not proxify Date properties", () => {
      const entity = new Sensor('example', 'Example Sensor');
      const returnedEntity = service.add(entity);

      returnedEntity.attributes.date = new Date();

      expect(util.types.isProxy(returnedEntity.attributes.date)).toBeFalsy();
    });

    it('should return all registered entities', () => {
      const entities = [];
      entities.push(service.add(new Sensor('sensor', 'Test')));
      entities.push(service.add(new Switch('switch', 'Test')));

      expect(service.getAll()).toStrictEqual(entities);
    });

    it('should throw an exception when adding a sensor with an existing id', () => {
      const entity = new Sensor('duplicate_sensor', 'Duplicate');
      service.add(entity);

      expect(() => service.add(entity)).toThrow(Error);
    });

    it('should include entity customizations with new entities', () => {
      const entity = new Sensor('customized_sensor', 'custom');
      const customizations: Array<EntityCustomization<any>> = [
        {
          for: SensorConfig,
          overrides: {
            icon: 'mdi:test',
          },
        },
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
  })

  describe('Entity Updates', () => {
    it('should announce new entities to publishers', () => {
      const entity = new Sensor('vip_sensor', 'VIP');
      const spy = jest.spyOn(emitter, 'emit');

      service.add(entity);
      expect(spy).toHaveBeenCalledWith('newEntity', entity, undefined);
    });

    it('should send state updates to publishers', () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      entityProxy.state = 1337;
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entity, [{
        newValue: 1337,
        oldValue: undefined,
        path: '/state'
      }], true);
    });

    it('should send attribute updates to publishers', () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('attributes_sensor', 'Sensor with attributes');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      entityProxy.attributes.test = '123';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [{
          newValue: '123',
          oldValue: undefined,
          path: '/attributes/test'
        }],
        true
      );
    });

    it("should not send updates for non-changed values", () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.state = 'abc';
      jest.advanceTimersByTime(250);
      entityProxy.state = 'abc';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should not include diffs for non-changed values", () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.state = 'abc';
      entityProxy.state = 'abc';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entityProxy, [{
        newValue: 'abc',
        oldValue: undefined,
        path: '/state'
      }], true);
    });

    it("should send updates for type-changed values", () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.state = '123';
      jest.advanceTimersByTime(250);
      entityProxy.state = 123;
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should send include old values in entity updates", () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.state = 'abc';
      jest.advanceTimersByTime(250);
      entityProxy.state = 'def';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entity, [{
        newValue: 'def',
        oldValue: 'abc',
        path: '/state'
      }], true)
    });

    it("should emit entity updates for array changes", () => {
      jest.useFakeTimers('modern')

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.attributes.test = ['item1'];
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entityProxy, [{
        newValue: ['item1'],
        oldValue: undefined,
        path: '/attributes/test'
      }], true)

      entityProxy.attributes.test.push('item2');
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entityProxy, [{
        newValue: 'item2',
        oldValue: undefined,
        path: '/attributes/test/1'
      }], true)
    });

    it("should send updates for nested objects", () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('test_sensor', 'Test Sensor');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(entity);
      spy.mockClear();

      entityProxy.attributes.test = {
        key1: 'value1'
      };
      jest.advanceTimersByTime(250);
      entityProxy.attributes.test.key1 = 'value2';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledWith('entityUpdate', entity, [{
        newValue: 'value2',
        oldValue: 'value1',
        path: '/attributes/test/key1'
      }], true);
    });
  });

  describe('Entity Authority', () => {
    it('should always mark non-distributed entity updates as authority', () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('distributed_sensor', 'Distribution', false);
      const spy = jest.spyOn(emitter, 'emit');
      clusterService.isMajorityLeader.mockReturnValue(false);

      const entityProxy = service.add(entity);
      spy.mockClear();
      entityProxy.state = true;
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('entityUpdate', expect.anything(), expect.anything(), true)
    });

    it('should mark distributed entity updates as non-authority if not the leader', () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('distributed_sensor', 'Distribution', true);
      const spy = jest.spyOn(emitter, 'emit');
      clusterService.isMajorityLeader.mockReturnValue(false);

      const entityProxy = service.add(entity);
      spy.mockClear();
      entityProxy.state = true;
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('entityUpdate', expect.anything(), expect.anything(), false)
    });

    it('should mark distributed entity updates as authority if the leader', () => {
      jest.useFakeTimers('modern');

      const entity = new Sensor('distributed_sensor', 'Distribution', true);
      const spy = jest.spyOn(emitter, 'emit');
      clusterService.isMajorityLeader.mockReturnValue(true);

      const entityProxy = service.add(entity);
      spy.mockClear();
      entityProxy.state = true;
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('entityUpdate', expect.anything(), expect.anything(), true)
    });

    it('should mark distributed entity updates as authority if state is not locked', () => {
      jest.useFakeTimers('modern')

      const entity = new Sensor(
        'distributed_sensor',
        'Distribution',
        true,
        false
      );
      const spy = jest.spyOn(emitter, 'emit');
      clusterService.isMajorityLeader.mockReturnValue(false);

      const entityProxy = service.add(entity);
      spy.mockClear();
      entityProxy.state = 'test';
      jest.advanceTimersByTime(250);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('entityUpdate', expect.anything(), expect.anything(), true)
    });
  })

  describe('Entity Refresh', () => {
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

    it('should send out events for all entities when refreshing as non-leader', () => {
      clusterService.isMajorityLeader.mockReturnValue(false);
      const spy = jest.spyOn(emitter, 'emit');

      const sensor1 = new Sensor('sensor1', 'Sensor 1');
      sensor1.state = 1;
      sensor1.attributes = {
        test: 'abc',
      };
      service.add(sensor1);
      const sensor2 = new Sensor('sensor2', 'Sensor 2', true);
      sensor2.state = 2;
      service.add(sensor2);
      const sensor3 = new Sensor('sensor3', 'Sensor 3', true, false);
      sensor3.state = 3;
      service.add(sensor3);
      spy.mockClear();

      service.refreshStates();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor1, true);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor2, false);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor3, true);
    });

    it('should send out events for all non-distributed or locked entities when refreshing as majority leader', () => {
      clusterService.isMajorityLeader.mockReturnValue(true);
      const spy = jest.spyOn(emitter, 'emit');

      const sensor1 = new Sensor('sensor1', 'Sensor 1');
      sensor1.state = 1;
      sensor1.attributes = {
        test: 'abc',
      };
      service.add(sensor1);
      const sensor2 = new Sensor('sensor2', 'Sensor 2', true);
      sensor2.state = 2;
      service.add(sensor2);
      const sensor3 = new Sensor('sensor3', 'Sensor 3', true, false);
      sensor3.state = 3;
      service.add(sensor3);
      spy.mockClear();

      service.refreshStates();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor1, true);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor2, true);
      expect(spy).toHaveBeenCalledWith('entityRefresh', sensor3, true);
    });
  })

  describe('Entity Behaviors', () => {
    it('should debounce state updates if configured', () => {
      jest.useFakeTimers('modern');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(
        new Sensor('debounced_entity', 'Debounce Test')
      );
      spy.mockClear();

      entityProxy.state = 42;
      entityProxy.state = 1337;

      expect(entityProxy.state).toBeUndefined();

      jest.runAllTimers();

      expect(entityProxy.state).toBe(1337);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [{
          newValue: 1337,
          oldValue: undefined,
          path: '/state'
        }],
        true
      );
    });

    it('should debounce state updates on leading edge if configured', () => {
      jest.useFakeTimers('modern');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(
        new Sensor('leading_debounced_entity', 'Debounce Test')
      );
      spy.mockClear();

      entityProxy.state = 42;
      entityProxy.state = 1337;

      expect(entityProxy.state).toBe(42);

      jest.runAllTimers();

      expect(entityProxy.state).toBe(42);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [{
          newValue: 42,
          oldValue: undefined,
          path: '/state'
        }],
        true
      );
    });

    it('should calculate rolling average for non-number states if configured', () => {
      jest.useFakeTimers('modern');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(
        new Sensor('rolling_average_entity', 'Rolling Test')
      );
      spy.mockClear();

      entityProxy.state = 'test1';
      jest.advanceTimersByTime(250);

      expect(entityProxy.state).toBe('test1');
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [{
          newValue: 'test1',
          oldValue: undefined,
          path: '/state'
        }],
        true
      );

      jest.setSystemTime(Date.now() + 10 * 1000);
      entityProxy.state = 'test2';
      expect(entityProxy.state).toBe('test1');

      jest.advanceTimersByTime(11 * 1000);
      expect(entityProxy.state).toBe('test2');
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [{
          newValue: 'test2',
          oldValue: 'test1',
          path: '/state'
        }],
        true
      );
      expect(spy).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(50 * 1000);
      expect(entityProxy.state).toBe('test2');
    });

    it('should calculate rolling average for number states if configured', () => {
      jest.useFakeTimers('modern');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(
        new Sensor('rolling_average_entity', 'Rolling Test')
      );
      spy.mockClear();

      entityProxy.state = 10;
      jest.advanceTimersByTime(1000);
      expect(entityProxy.state).toBe(10);

      jest.advanceTimersByTime(250);
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [
          expect.objectContaining({
            newValue: 10
          })
        ],
        true
      );

      jest.advanceTimersByTime(9 * 1000 - 250);
      entityProxy.state = 20;
      expect(entityProxy.state).toBe(10);

      jest.advanceTimersByTime(6 * 1000);
      expect(entityProxy.state).toBe(13.75);

      jest.advanceTimersByTime(250)
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [
          expect.objectContaining({
            newValue: 13.75
          })
        ],
        true
      );

      jest.advanceTimersByTime(55 * 1000 - 250);
      expect(entityProxy.state).toBe(20);

      jest.advanceTimersByTime(250)
      expect(spy).toHaveBeenCalledWith(
        'entityUpdate',
        entityProxy,
        [
          expect.objectContaining({
            newValue: 20
          })
        ],
        true
      );
    });

    it('should chain entity behaviors together', () => {
      jest.useFakeTimers('modern');
      const spy = jest.spyOn(emitter, 'emit');

      const entityProxy = service.add(
        new Sensor('chained_entity', 'Chaining Test')
      );
      spy.mockClear();

      entityProxy.state = 'test1';
      jest.advanceTimersByTime(500);
      expect(entityProxy.state).toBeUndefined();

      entityProxy.state = 'test2';
      jest.advanceTimersByTime(1000);
      expect(entityProxy.state).toBe('test2');

      jest.advanceTimersByTime(5000);
      entityProxy.state = 'test3';
      jest.advanceTimersByTime(1000);
      expect(entityProxy.state).toBe('test2');

      jest.advanceTimersByTime(7000);
      expect(entityProxy.state).toBe('test3');
    });
  });

});
