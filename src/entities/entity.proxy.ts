import { Entity } from './entity';
import { AttributesProxyHandler } from './attributes.proxy';
import { EntitiesEventEmitter } from './entities.events';
import { EntityBehavior } from './entities.config';
import * as _ from 'lodash';

export class EntityProxyHandler implements ProxyHandler<Entity> {
  private readonly stateUpdateFunction: (target: Entity, value: any) => void;

  constructor(
    private readonly emitter: EntitiesEventEmitter,
    private readonly isLeader: () => boolean,
    private readonly behavior?: EntityBehavior
  ) {
    this.stateUpdateFunction = this.behavior?.debounce?.wait
      ? _.debounce(
          this.emitStateUpdate.bind(this),
          this.behavior.debounce.wait * 1000,
          { maxWait: this.behavior.debounce.maxWait * 1000 }
        )
      : this.emitStateUpdate;
  }

  get(target: Entity, p: string | number | symbol): any {
    if (p === 'attributes') {
      return new Proxy(
        target[p],
        new AttributesProxyHandler(
          target.id,
          target.distributed,
          this.emitter,
          this.isLeader
        )
      );
    } else {
      return target[p];
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: Entity, p: string | number | symbol, value: any): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (
      p === 'state' &&
      oldValue !== value &&
      (!target.distributed || this.isLeader())
    ) {
      this.stateUpdateFunction(target, value);
    }

    return true;
  }

  private emitStateUpdate(target: Entity, value: any): void {
    this.emitter.emit('stateUpdate', target.id, value, target.distributed);
  }
}
