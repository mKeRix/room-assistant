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

  onApplicationBootstrap(): void {
    this.clusterService.on('elected', () => {
      this.refreshStates();
    });
  }

  has(id: string): boolean {
    return this.entities.has(id);
  }

  get(id: string): Entity {
    return this.entities.get(id);
  }

  add(
    entity: Entity,
    customizations?: Array<EntityCustomization<any>>
  ): Entity {
    if (this.entities.has(entity.id)) {
      throw new Error(`Entity with id ${entity.id} already exists!`);
    }

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

  refreshStates(): void {
    this.logger.log('Refreshing entity states');
    this.entities.forEach(entity => {
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
