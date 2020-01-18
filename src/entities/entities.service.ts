import { Injectable } from '@nestjs/common';
import { Entity } from './entity.entity';
import { PublishersService } from '../publishers/publishers.service';
import { EntityProxyHandler } from './entity.proxy';
import { EntityOptions } from '../publishers/entity-options.entity';

@Injectable()
export class EntitiesService {
  private readonly entities = new Map<string, Entity>();

  constructor(private readonly publishersService: PublishersService) {}

  has(id: string): boolean {
    return this.entities.has(id);
  }

  get(id: string): Entity {
    return this.entities.get(id);
  }

  add(entity: Entity, entityOptions?: EntityOptions): Entity {
    if (this.entities.has(entity.id)) {
      throw new Error(`Entity with id ${entity.id} already exists!`);
    }

    const proxy = new Proxy<Entity>(
      entity,
      new EntityProxyHandler(
        this.publishersService.publishNewState.bind(this.publishersService),
        this.publishersService.publishNewAttributes.bind(this.publishersService)
      )
    );
    this.entities.set(entity.id, proxy);
    this.publishersService.publishNewEntity(proxy, entityOptions);
    return proxy;
  }
}
