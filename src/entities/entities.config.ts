export class EntitiesConfig {
  behaviors: { [entityId: string]: EntityBehavior } = {};
}

export class EntityBehavior {
  debounce?: DebounceOptions;
}

class DebounceOptions {
  wait?: number;
  maxWait?: number;
}
