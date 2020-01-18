import { Entity } from './entity.entity';
import { AttributesProxyHandler } from './attributes.proxy';
import { EntitiesEventEmitter } from './entities.events';

export class EntityProxyHandler implements ProxyHandler<Entity> {
  constructor(private readonly emitter: EntitiesEventEmitter) {}

  get(target: Entity, p: string | number | symbol, receiver: any): any {
    if (p === 'attributes') {
      return new Proxy(
        target[p],
        new AttributesProxyHandler(target.id, target.distributed, this.emitter)
      );
    } else {
      return target[p];
    }
  }

  set(
    target: Entity,
    p: string | number | symbol,
    value: any,
    receiver: any
  ): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (p === 'state' && oldValue !== value) {
      this.emitter.emit('stateUpdate', target.id, value, target.distributed);
    }

    return true;
  }
}
