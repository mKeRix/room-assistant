export class EntitiesConfig {
  behaviors: { [entityId: string]: EntityBehavior } = {};
}

export class EntityBehavior {
  debounce?: DebounceOptions;
}

export class DebounceOptions {
  wait?: number;
  maxWait?: number;
}
