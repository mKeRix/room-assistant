import { Entity } from './entity.dto';
import { DebounceOptions } from './entities.config';
import _ from 'lodash';

export class DebounceProxyHandler implements ProxyHandler<Entity> {
  private readonly debouncedStateUpdate: (target: Entity, value: any) => void;

  constructor(config: DebounceOptions) {
    this.debouncedStateUpdate = _.debounce(
      (target, value) => {
        target.state = value;
      },
      config.wait * 1000,
      {
        maxWait: config.maxWait * 1000,
        leading: config.leading ?? false,
        trailing: config.trailing ?? true,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: Entity, p: PropertyKey, value: any): boolean {
    const oldValue = target[p];

    if (p === 'state' && oldValue !== value) {
      this.debouncedStateUpdate(target, value);
    } else {
      target[p] = value;
    }

    return true;
  }
}
