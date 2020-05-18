# Entities

**Config Key:** `entities`

Each entity that room-assistant exposes is managed by a central registry and has a locally unique ID. You can apply some configuration options to any entity to modify the behavior.

## Settings

| Name        | Type                    | Default | Description                                       |
| ----------- | ----------------------- | ------- | ------------------------------------------------- |
| `behaviors` | [Behaviors](#behaviors) |         | Options that modify the behavior of the entities. |

### Behaviors

Behaviors may be set per entity ID, with the ID being the key and an object with some of the properties below as value in the configuration map.

| Name       | Type                  | Default | Description                                        |
| ---------- | --------------------- | ------- | -------------------------------------------------- |
| `debounce` | [Debounce](#debounce) |         | Allows you to debounce state updates for entities. |

#### Debounce

Debouncing is especially helpful for sensors that jump states quickly in an incorrect manner. This could for example be the case for some GPIO sensors or thermopiles.

| Name      | Type   | Default | Description                                                  |
| --------- | ------ | ------- | ------------------------------------------------------------ |
| `wait`    | Number |         | Number of seconds to wait after the last time the state was updated before publishing it to integrations. |
| `maxWait` | Number |         | Maximum number of seconds that a state update may be delayed. If left undefined there will be no limit. |

::: details Example Config

```yaml
entities:
  behaviors:
    d6t_occupancy_count:
      debounce:
        wait: 0.75
        maxWait: 2
```

:::