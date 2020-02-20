# Configuration

room-assistant can be configured using YAML and JSON files. It will look for them in the `config` subdirectory of the current working directory. The files in the config folder are loaded according to a [specific order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order) and then merged into a single configuration. In most cases you should only need a single file called `local.yml` or `local.json` in the config folder though.

For example, let's say you are launching room-assistant from the directory `/home/pi/room-assistant`. In this case you should create a file `/home/pi/room-assistant/config/local.yml` and put your configuration in there.

You can find the global configuration options below and the ones specific to some integrations on their [respective pages](/integrations/).

## Configuring with Docker

The official [Docker image](https://hub.docker.com/r/mkerix/room-assistant/) can be configured in two different ways. You can either mount your local config folder into the container as `/room-assistant/config` or you can provide the configuration as JSON through an environment variable.

::: details Example docker-compose.yml

```yaml
version: '3'
services:
  room-assistant:
    image: mkerix/room-assistant
    network_mode: host
    volumes:
      - /var/run/dbus:/var/run/dbus
    environment:
      NODE_CONFIG: >
        {
          "global": {
            "instanceName": "living-room",
            "integrations": ["homeAssistant", "bluetoothClassic"]
          }
        }
```

:::

## Core Settings

**Config Key:** `global`

room-assistant exposes a few settings that affect the overall behavior of the application.

| Name           | Type   | Default  | Description                                                                                      |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------------------ |
| `instanceName` | String | Hostname | The name of the room-assistant instance. May be used as state for some sensors. Put something in |
| `integrations` | Array  |          | The integrations that should be loaded on this instance, denoted as camelCase.                   |

::: details Example Config
```yaml
global:
  instanceName: bedroom
  integrations:
    - bluetoothLowEnergy
    - homeAssistant
```
:::
