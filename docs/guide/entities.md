# Entities

**Config Key:** `entities`

Each entity that room-assistant exposes is managed by a central registry and has a locally unique ID. You can apply some configuration options to any entity to modify the behavior.

## Settings

| Name        | Type                    | Default | Description                                       |
| ----------- | ----------------------- | ------- | ------------------------------------------------- |
| `behaviors` | [Behaviors](#behaviors) |         | Options that modify the behavior of the entities. |

### Behaviors

Behaviors may be set per entity ID, with the ID being the key and an object with some of the properties below as value in the configuration map.

| Name             | Type                                | Default | Description                                                  |
| ---------------- | ----------------------------------- | ------- | ------------------------------------------------------------ |
| `debounce`       | [Debounce](#debounce)               |         | Allows you to debounce state updates for entities.           |
| `rollingAverage` | [Rolling Average](#rolling-average) |         | Makes sensors output the average value based on a sliding window. |

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

#### Rolling Average

This behavior is useful for when you have a sensor that on average has the correct value, but sometimes changes to wrong states. It will make the sensor output the average value that it has seen over the window period that you configured. Depending on the state type the average calculation behaves differently:

- For numeric states, the weighted average of all values seen in the window period will be calculated.
- For other states, the state that the original sensor spent the longest time in over the last `window` seconds will be chosen as the output.

The state itself is updated every second.

| Name     | Type   | Default | Description                                                  |
| -------- | ------ | ------- | ------------------------------------------------------------ |
| `window` | Number |         | Number of seconds to look back for when calculating the average state. |

::: details Example Config

```yaml
entities:
  behaviors:
    bluetooth-classic-xx-tracker:
      rollingAverage:
        window: 300
```

:::