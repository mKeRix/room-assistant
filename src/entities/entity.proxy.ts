import { Entity } from './entity.dto';
import { EntitiesEventEmitter, PropertyDiff } from './entities.events';
import Timeout = NodeJS.Timeout;

export class EntityProxyHandler implements ProxyHandler<Entity> {
  private diff: Array<PropertyDiff> = [];
  private target?: Entity;
  private flushTimeout?: Timeout;

  constructor(
    private readonly emitter: EntitiesEventEmitter,
    private readonly hasAuthorityOver: (entity: Entity) => boolean
  ) {}

  get(target: Entity, p: PropertyKey): any {
    if (
      typeof target[p] === 'object' &&
      target[p] !== null &&
      !(target[p] instanceof Date)
    ) {
      return new Proxy(
        target[p],
        new EntityPropertyProxyHandler(`/${p.toString()}`, (diff) =>
          this.emitEntityUpdate(target, diff)
        )
      );
    } else {
      return target[p];
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: Entity, p: PropertyKey, value: any): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (oldValue !== value) {
      this.emitEntityUpdate(target, [
        { path: `/${p.toString()}`, oldValue, newValue: value },
      ]);
    }

    return true;
  }

  private emitEntityUpdate(entity: Entity, diff: Array<PropertyDiff>): void {
    this.target = entity;
    this.diff.push(...diff);

    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(this.flushEntityUpdates.bind(this), 100);
    }
  }

  private flushEntityUpdates(): void {
    this.emitter.emit(
      'entityUpdate',
      this.target,
      this.diff,
      this.hasAuthorityOver(this.target)
    );

    this.diff = [];
    this.flushTimeout = undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
class EntityPropertyProxyHandler<T extends object> implements ProxyHandler<T> {
  constructor(
    private readonly path: string,
    private readonly emitterFunc: (diff: Array<PropertyDiff>) => void
  ) {}

  get(target: T, p: PropertyKey): any {
    if (
      typeof target[p] === 'object' &&
      target[p] !== null &&
      !(target[p] instanceof Date)
    ) {
      return new Proxy(
        target[p],
        new EntityPropertyProxyHandler(
          `${this.path}/${p.toString()}`,
          this.emitterFunc
        )
      );
    } else {
      return target[p];
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: T, p: PropertyKey, value: any): boolean {
    const oldValue = target[p];
    target[p] = value;

    if (oldValue !== value) {
      this.emitterFunc([
        { path: `${this.path}/${p.toString()}`, oldValue, newValue: value },
      ]);
    }

    return true;
  }
}
