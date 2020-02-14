import { Injectable } from '@nestjs/common';
import { Entity } from './entity';
import { EntityProxyHandler } from './entity.proxy';
import { InjectEventEmitter } from 'nest-emitter';
import { EntitiesEventEmitter } from './entities.events';
import { EntityCustomization } from './entity-customization.interface';
import { ClusterService } from '../cluster/cluster.service';

@Injectable()
export class EntitiesService {
  private readonly entities: Map<string, Entity> = new Map<string, Entity>();

  constructor(
    private readonly clusterService: ClusterService,
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {}

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
}
