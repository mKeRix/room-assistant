import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Entity } from './entity.dto';
import { EntityProxyHandler } from './entity.proxy';
import { InjectEventEmitter } from 'nest-emitter';
import { EntitiesEventEmitter } from './entities.events';
import { EntityCustomization } from './entity-customization.interface';
import { ClusterService } from '../cluster/cluster.service';
import { ConfigService } from '../config/config.service';
import { EntitiesConfig } from './entities.config';
import { DebounceProxyHandler } from './debounce.proxy';
import { RollingAverageProxyHandler } from './rolling-average.proxy';

@Injectable()
export class EntitiesService implements OnApplicationBootstrap {
  private readonly config: EntitiesConfig;
  private readonly entities: Map<string, Entity> = new Map<string, Entity>();
  private readonly logger: Logger;

  constructor(
    private readonly clusterService: ClusterService,
    private readonly configService: ConfigService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
    this.config = configService.get('entities');
    this.logger = new Logger(EntitiesService.name);
  }

  /**
   * Lifecycle hook, called once the application has started.
   */
  onApplicationBootstrap(): void {
    this.clusterService.on('elected', () => {
      this.refreshStates();
    });
  }

  /**
   * Checks whether a given entity ID has already been registered.
   *
   * @param id - Entity id
   * @returns Registered or not
   */
  has(id: string): boolean {
    return this.entities.has(id);
  }

  /**
   * Retrieves the entity instance for a registered ID.
   *
   * @param id - Entity id
   * @returns Entity or undefined if not found
   */
  get(id: string): Entity {
    return this.entities.get(id);
  }

  /**
   * Retrieves all registered entities.
   *
   * @returns Registered entities
   */
  getAll(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Adds a new entity and applies ES6 proxies to watch for state/attribute changes.
   *
   * @param entity - Entity to register
   * @param customizations - Customization objects to be used by other integrations
   * @returns Entity with applied state/attributes watcher
   */
  add(
    entity: Entity,
    customizations?: Array<EntityCustomization<any>>
  ): Entity {
    if (this.entities.has(entity.id)) {
      throw new Error(`Entity with id ${entity.id} already exists!`);
    }

    this.logger.debug(`Adding new entity ${entity.id}`);
    let proxy = new Proxy<Entity>(
      entity,
      new EntityProxyHandler(
        this.emitter,
        this.clusterService.isMajorityLeader.bind(this.clusterService)
      )
    );
    proxy = this.applyEntityBehaviors(proxy);

    this.entities.set(entity.id, proxy);
    this.emitter.emit('newEntity', proxy, customizations);
    return proxy;
  }

  /**
   * Applies configured entity behavior proxies to a given entity.
   *
   * @param entity - Entity to customize
   */
  private applyEntityBehaviors(entity: Entity): Entity {
    const behaviorConfig = this.config.behaviors[entity.id];
    let proxy = entity;

    if (behaviorConfig?.rollingAverage?.window) {
      proxy = new Proxy<Entity>(
        proxy,
        new RollingAverageProxyHandler(behaviorConfig.rollingAverage)
      );
    }

    if (behaviorConfig?.debounce?.wait) {
      proxy = new Proxy<Entity>(
        proxy,
        new DebounceProxyHandler(behaviorConfig.debounce)
      );
    }

    return proxy;
  }

  /**
   * Emits the current states of all entities that this instance has power over.
   */
  refreshStates(): void {
    this.logger.log('Refreshing entity states');
    this.entities.forEach((entity) => {
      const hasAuthority = !entity.distributed || !entity.stateLocked || this.clusterService.isMajorityLeader()

      this.emitter.emit(
        'entityRefresh',
        entity,
        hasAuthority
      )
    });
  }
}
