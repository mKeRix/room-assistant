import { Entity } from './entity.dto';
import _ from 'lodash';
import { RollingAverageOptions } from './entities.config';
import Timeout = NodeJS.Timeout;

export class RollingAverageProxyHandler implements ProxyHandler<Entity> {
  private values: Array<TimedValue<any>> = [];
  private updateInterval: Timeout;

  constructor(private readonly config: RollingAverageOptions) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  set(target: Entity, p: PropertyKey, value: any): boolean {
    if (p == 'state') {
      this.values.push(new TimedValue<any>(value));
      this.updateTargetState(target);

      if (this.updateInterval === undefined) {
        setInterval(() => this.updateTargetState(target), 1000);
      }
    } else {
      target[p] = value;
    }

    return true;
  }

  private updateTargetState(target: Entity) {
    this.values = this.values.filter((value, index, array) => {
      return (
        value.msAgo <= this.config.window * 1000 ||
        array[index + 1]?.msAgo <= this.config.window * 1000
      );
    });

    if (this.values.length > 0) {
      const weights = this.values.reduce<Map<any, number>>(
        (map, value, index, array) => {
          const weight =
            _.clamp(value.msAgo, this.config.window * 1000) -
            (array[index + 1]?.msAgo || 0);
          if (map.has(value.value)) {
            map.set(value.value, map.get(value.value) + weight);
          } else {
            map.set(value.value, weight);
          }
          return map;
        },
        new Map()
      );

      if (Array.from(weights.keys()).every((x) => typeof x === 'number')) {
        // actual weighted average
        const [weightedValueSum, weightSum] = Array.from(
          weights.entries()
        ).reduce<[number, number]>(
          (previous, value) => {
            return [previous[0] + value[0] * value[1], previous[1] + value[1]];
          },
          [0, 0]
        );
        target.state = weightSum > 0 ? weightedValueSum / weightSum : undefined;
      } else {
        // state with max weight wins
        const winner = Array.from(weights.entries()).reduce<[any, number]>(
          (previous, value) => {
            return previous[0] == undefined || value[1] > previous[1]
              ? value
              : previous;
          },
          [undefined, 0]
        );
        target.state = winner[0];
      }
    }
  }
}

class TimedValue<T> {
  value: T;
  readonly createdAt: Date = new Date();

  constructor(value: T) {
    this.value = value;
  }

  get msAgo(): number {
    return Date.now() - this.createdAt.getTime();
  }
}
