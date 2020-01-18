import { Injectable } from '@nestjs/common';
import { Entity } from './entity.entity';
import { EntityProxyHandler } from './entity.proxy';
import { EntityOptions } from './entity-options.entity';
import { InjectEventEmitter } from 'nest-emitter';
import { EntitiesEventEmitter } from './entities.events';

@Injectable()
export class EntitiesService {
  private readonly entities = new Map<string, Entity>();

  constructor(
    @InjectEventEmitter() private readonly emitter: EntitiesEventEmitter
  ) {}

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
      new EntityProxyHandler(this.emitter)
    );
    this.entities.set(entity.id, proxy);
    this.emitter.emit('newEntity', proxy, entityOptions);
    return proxy;
  }
}
