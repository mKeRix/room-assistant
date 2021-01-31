export class EntitiesConfig {
  behaviors: { [entityId: string]: EntityBehavior } = {};
}

export class EntityBehavior {
  debounce?: DebounceOptions;
  rollingAverage?: RollingAverageOptions;
}

export class DebounceOptions {
  wait?: number;
  maxWait?: number;
  leading: boolean;
  trailing?: boolean;
}

export class RollingAverageOptions {
  window?: number;
}
