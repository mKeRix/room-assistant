import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Entity } from './entity';
import { EntityProxyHandler } from './entity.proxy';
import { InjectEventEmitter } from 'nest-emitter';
import { EntitiesEventEmitter } from './entities.events';
import { EntityCustomization } from './entity-customization.interface';
import { ClusterService } from '../cluster/cluster.service';

@Injectable()
export class EntitiesService implements OnApplicationBootstrap {
  private readonly entities: Map<string, Entity> = new Map<string, Entity>();
  private readonly logger: Logger;

  constructor(
    private readonly clusterService: ClusterService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {
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
    const proxy = new Proxy<Entity>(
      entity,
      new EntityProxyHandler(
        this.emitter,
        this.clusterService.isMajorityLeader.bind(this.clusterService)
      )
    );
    this.entities.set(entity.id, proxy);
    this.emitter.emit('newEntity', proxy, customizations);
    return proxy;
  }

  /**
   * Emits the current states of all entities that this instance has power over.
   */
  refreshStates(): void {
    this.logger.log('Refreshing entity states');
    this.entities.forEach((entity) => {
      if (!entity.distributed || this.clusterService.isMajorityLeader()) {
        this.emitter.emit(
          'stateUpdate',
          entity.id,
          entity.state,
          entity.distributed
        );
        this.emitter.emit(
          'attributesUpdate',
          entity.id,
          entity.attributes,
          entity.distributed
        );
      }
    });
  }
}
