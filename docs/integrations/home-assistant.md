# Home Assistant Core

**Integration Key:** `homeAssistant`

The [Home Assistant Core](https://www.home-assistant.io) integration shares data with the home automation software over [MQTT](https://www.home-assistant.io/integrations/mqtt/).

## Requirements

::: tip

**Running on Home Assistant OS?** If you are also using the MQTT server add-on room-assistant will automatically pick up the correct credentials - no configuration needed!

:::

You will need to setup an MQTT broker that both your instance of Home Assistant Core and all instances of room-assistant can connect to. If you are using Home Assistant OS you can install the [official mosquitto add-on](https://github.com/home-assistant/hassio-addons/tree/master/mosquitto) to get started quickly.

room-assistant makes use of the [MQTT auto discovery](https://www.home-assistant.io/docs/mqtt/discovery/) features provided by Home Assistant Core to automatically create all entities for you. It is strongly recommended that you enable this feature when setting up the MQTT integration in Home Assistant Core.

## Device Trackers

Some integrations, such as [Bluetooth Classic](bluetooth-classic.md) or [Bluetooth Low Energy](bluetooth-low-energy.md) support the [MQTT device tracker](https://www.home-assistant.io/integrations/device_tracker.mqtt/) in Home Assistant Core. This is for example useful if you want to integrate the room-assistant presence detection with others in the form of a [person](https://www.home-assistant.io/integrations/person/). Unfortunately, device trackers can not be auto discovered by Home Assistant Core. To enable this feature you will have to edit your Home Assistant Core configuration manually and add a few lines as shown in the example below. You can get all your available device tracker topics from the room-assistant logs.

```yaml
device_tracker:
- platform: mqtt
  devices:
    apple_watch: 'room-assistant/device_tracker/bluetooth-classic-aa-aa-aa-aa-aa-aa-tracker/state'
  payload_home: 'true'
  payload_not_home: 'false'
  source_type: bluetooth
```

## Settings

| Name          | Type                          | Default                 | Description                                 |
| ------------- | ----------------------------- | ----------------------- | ------------------------------------------- |
| `mqttUrl`     | String                        | `mqtt://localhost:1883` | Connection string for your MQTT broker.     |
| `mqttOptions` | [MQTT Options](#mqtt-options) |                         | Additional options for the MQTT connection. |

### MQTT Options

| Name                 | Type    | Default | Description                                                  |
| -------------------- | ------- | ------- | ------------------------------------------------------------ |
| `username`           | String  |         | Username for authentication                                  |
| `password`           | String  |         | Password for authentication                                  |
| `rejectUnauthorized` | Boolean | `true`  | Whether MQTTS connections should fail for invalid certificates or not. Set this to `false` if you are using a self-signed certificate and connect via TLS. |

::: details Example Config

```yaml
global:
  integrations:
    - homeAssistant
homeAssistant:
  mqttUrl: mqtt://homeassistant.local:1883
  mqttOptions:
    username: youruser
    password: yourpass
```

:::