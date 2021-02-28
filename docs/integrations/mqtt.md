# MQTT

**Integration Key:** `mqtt`

::: tip

If you are looking to integrate with [Home Assistant Core](https://www.home-assistant.io) via MQTT take a look at the [Home Assistant integration](./home-assistant.md) instead.

:::

The MQTT integration will send messages with room-assistant entity update information to an [MQTT broker](https://mqtt.org).

## Message Format

Entity updates are sent into unique topics for each entity, grouped by instance name and entity type. The topic format is `baseTopic/instanceName/entityType/entityId`.

Each message will have the following properties:

- **entity** - This includes the whole current entity state, like you would see it in the [API](../guide/api.md).
- **hasAuthority** - This boolean value shows whether this update message comes from an entity that has authority over the entity. It will be `false` for distributed entity updates that are emitted from non-leader instances. You may use this to respect the room-assistant leader in your own automations, but you can of course also just pick a single instance to work off.

Optionally the message will also include the following properties:

- **diff** - This is an array of changes to the previous entity state. Each array item includes a `path` to the changed property based off the entity JSON root, the `oldValue` and the `newValue`. Could be used to monitor for specific changes only. This property will not be included when instances emit an entity refresh (e.g. after re-connecting to the MQTT broker).

::: details Example Message

This message could have been posted to `room-assistant/entity/living-room/bluetooth-low-energy-presence-sensor/ble-some-id`:

```json
{
  "entity": {
    "attributes": {
      "distance": 3.6,
      "lastUpdatedAt": "2021-02-28T14:17:33.141Z"
    },
    "id": "ble-some-id",
    "name": "Something Room Presence",
    "distributed": true,
    "stateLocked": true,
    "distances": {
      "bedroom": {
        "lastUpdatedAt": "2021-02-28T14:17:32.605Z",
        "distance": 9.4,
        "outOfRange": false
      },
      "living-room": {
        "lastUpdatedAt": "2021-02-28T14:17:33.141Z",
        "distance": 3.6,
        "outOfRange": false
      }
    },
    "timeout": 180,
    "measuredValues": {
      "bedroom": {
        "rssi": -79.81192947697268,
        "measuredPower": -59
      },
      "living-room": {
        "rssi": -70.40174705168248,
        "measuredPower": -59
      }
    },
    "state": "living-room"
  },
  "diff": [
    {
      "path": "/measuredValues/living-room",
      "oldValue": {
        "rssi": -73.37709762753302,
        "measuredPower": -59
      },
      "newValue": {
        "rssi": -70.40174705168248,
        "measuredPower": -59
      }
    },
    {
      "path": "/distances/living-room",
      "oldValue": {
        "lastUpdatedAt": "2021-02-28T14:17:32.308Z",
        "distance": 3.8,
        "outOfRange": false
      },
      "newValue": {
        "lastUpdatedAt": "2021-02-28T14:17:33.141Z",
        "distance": 3.6,
        "outOfRange": false
      }
    }
  ],
  "hasAuthority": true
}
```

:::

To get started with your automations based on these topics it is recommended to just explore the data provided in the topics using e.g. a GUI MQTT tool.

## Settings

| Name          | Type                          | Default                 | Description                                                  |
| ------------- | ----------------------------- | ----------------------- | ------------------------------------------------------------ |
| `mqttUrl`     | String                        | `mqtt://localhost:1883` | Connection string for your MQTT broker.                      |
| `mqttOptions` | [MQTT Options](#mqtt-options) |                         | Additional options for the MQTT connection.                  |
| `baseTopic`   | String                        | `room-assistant/entity` | Base for the entity update topics.                           |
| `qos`         | Number                        | `0`                     | Quality of Service level that the messages will be sent with. |
| `retain`      | Boolean                       | `false`                 | Whether to mark the messages as to retain or not.            |

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
    - mqtt
mqtt:
  mqttUrl: mqtt://localhost:1883
  mqttOptions:
    username: youruser
    password: yourpass
  retain: false
```

:::