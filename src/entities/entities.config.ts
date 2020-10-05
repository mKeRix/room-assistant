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
}

export class RollingAverageOptions {
  window?: number;
}
