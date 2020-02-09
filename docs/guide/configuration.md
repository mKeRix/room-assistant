# Configuration

room-assistant can be configured using YAML and JSON files. It will look for them in the `config` subdirectory of the current working directory.
The files in the config folder are loaded according to a [specific order](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order) and then merged into a single configuration.
In most cases you should only need a single file called `local.yml` or `local.json` in the config folder though.

For example, let's say you are launching room-assistant from the directory `/home/pi/room-assistant`.
In this case you should create a file `/home/pi/room-assistant/config/local.yml` and put your configuration in there.

You can find the global configuration options below and the ones specific to some integrations on their respective pages.

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

## Cluster Settings

**Config Key:** `cluster`

If you are running multiple room-assistant instances they come together in a cluster. By default, the instances discover each other using mDNS. This requires all of them live in the same subnet. You can also specify the adresses of other instances and tweak some other things manually.

| Name               | Type   | Default | Description                                                                                       |
| ------------------ | ------ | ------- | ------------------------------------------------------------------------------------------------- |
| `networkInterface` | String |         | The specific network interface that room-assistant should advertise its presence on, e.g. `eth0`. |
| `port`             | Number | `6425`  | The UDP port that room-assistant should use for internal communication.                           |
| `peerAddresses`    | Array  |         | A list of endpoint addresses (IP + port) of other room-assistant instances.                       |

::: details Example Config
```yaml
cluster:
  networkInterface: wlan0
  port: 6425
  peerAddresses:
    - 192.168.1.10:6425
    - 192.168.1.11:6425
```
:::
