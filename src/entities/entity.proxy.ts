import { Entity } from './entity.entity';
import { AttributesProxyHandler } from './attributes.proxy';

export class EntityProxyHandler implements ProxyHandler<Entity> {
  constructor(
    private readonly stateCallback: (
      id: string,
      state: string | number | boolean,
      distributed?: boolean
    ) => void,
    private readonly attributesCallback: (
      entityId: string,
      attributes: { [key: string]: any },
      distributed?: boolean
    ) => void
  ) {}

  get(target: Entity, p: string | number | symbol, receiver: any): any {
    if (p === 'attributes') {
      return new Proxy(
        target[p],
        new AttributesProxyHandler(
          target.id,
          target.distributed,
          this.attributesCallback
        )
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
      this.stateCallback(target.id, value, target.distributed);
    }

    return true;
  }
}
