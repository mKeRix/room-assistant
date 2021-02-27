import { Entity } from "./entity.dto";
import { EntitiesEventEmitter, PropertyDiff } from "./entities.events";

export class EntityProxyHandler implements ProxyHandler<Entity> {
  constructor(private readonly emitter: EntitiesEventEmitter, private readonly isLeader: () => boolean) {
  }

  get(target: Entity, p: PropertyKey): any {
    if (typeof target[p] === 'object' && target[p] !== null && !(target[p] instanceof Date)) {
      return new Proxy(target[p], new EntityPropertyProxyHandler(`/${p.toString()}`, (diff) => this.emitEntityUpdate(target, diff)));
    } else {
      return target[p]
    }
}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: Entity, p: PropertyKey, value: any): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (oldValue !== value) {
      this.emitEntityUpdate(target, [{ path: `/${p.toString()}`, oldValue, newValue: value }])
    }

    return true;
  }

  private emitEntityUpdate(entity: Entity, diff: Array<PropertyDiff>): void {
    const hasAuthority = !entity.distributed || !entity.stateLocked || this.isLeader();

    this.emitter.emit('entityUpdate', entity, diff, hasAuthority)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
class EntityPropertyProxyHandler<T extends object> implements ProxyHandler<T> {

  constructor(private readonly path: string, private readonly emitterFunc: (diff: Array<PropertyDiff>) => void) {

  }

  get(target: T, p: PropertyKey): any {
    if (typeof target[p] === 'object' && target[p] !== null && !(target[p] instanceof Date)) {
      return new Proxy(target[p], new EntityPropertyProxyHandler(`${this.path}/${p.toString()}`, this.emitterFunc));
    } else {
      return target[p]
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: T, p: PropertyKey, value: any): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (oldValue !== value) {
      this.emitterFunc([{ path: `${this.path}/${p.toString()}`, oldValue, newValue: value }])
    }

    return true;
  }
}
