import _ from 'lodash';

export class AttributesProxyHandler
  implements ProxyHandler<{ [key: string]: string | number | boolean }> {
  constructor(
    private readonly entityId: string,
    private readonly distributed: boolean,
    private readonly attributesCallback: (
      entityId: string,
      attributes: { [key: string]: any },
      distributed?: boolean
    ) => void
  ) {}

  set(
    target: { [p: string]: string | number | boolean },
    p: string | number | symbol,
    value: any,
    receiver: any
  ): boolean {
    const oldValue = target[p as string];
    target[p as string] = value;

    if (!_.isEqual(value, oldValue)) {
      this.attributesCallback(this.entityId, target, this.distributed);
    }

    return true;
  }
}
