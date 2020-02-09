# Shell Commands

**Integration Key:** `shell`

The Shell integration allows you to execute any shell command on a schedule and use the output as the state of a sensor. This is useful for passing metrics about the machine that room-assistant is running on or for integrating sensors that do not have native support.

The commands are run with the same user that room-assistant is running with, so make sure your permissions are setup accordingly.

## Settings

| Name      | Type                      | Default | Description                           |
| --------- | ------------------------- | ------- | ------------------------------------- |
| `sensors` | [Shell Sensors](#sensors) |         | An array of shell sensor definitions. |

### Sensors

| Name                | Type   | Default | Description                                                  |
| ------------------- | ------ | ------- | ------------------------------------------------------------ |
| `name`              | String |         | Friendly name of this sensor.                                |
| `command`           | String |         | Shell command that should be executed.                       |
| `regex`             | String |         | Regex that is used for parsing the stdout output of the command, if configured. Otherwise the complete output is used as the state. |
| `cron`              | String |         | [Cron pattern](https://www.npmjs.com/package/node-cron#cron-syntax) describing the schedule that this command should be run with. |
| `icon`              | String |         | Icon that the sensor should be represented with in Home Assistant. |
| `unitOfMeasurement` | String |         | Unit of measurement of the sensor state, leave empty if none. |
| `deviceClass`       | String |         | Home Assistant [device class](https://www.home-assistant.io/integrations/sensor/#device-class) to be used for this sensor. |

::: details Example Config

```yaml
global:
  integrations:
    - shell
shell:
  sensors:
    - name: Kitchen Wifi Strength
      command: 'iwconfig wlan0 | grep -i quality'
      regex: 'Signal level=(-?[0-9]+) dBm'
      cron: '* * * * *'
      icon: mdi:wifi
      unitOfMeasurement: dBm
      deviceClass: signal_strength
```

:::