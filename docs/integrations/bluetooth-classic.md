# Bluetooth Classic

**Integration Key:** `bluetoothClassic`

The Bluetooth Classic integration can detect the location of any Bluetooth device within the home. It does this by sending out connection requests to the device addresses you configure on rotation and then checking the signal strength of the response. The configured Bluetooth devices do not need to be paired with your machines running room-assistant.

The integration has been tested to work great with the Apple Watch. You may see a minor hit on the battery life of the Bluetooth devices when enabling this.

## Requirements

### Running with NodeJS

This integration only works on Linux, as it depends on `hcitool`. On most Linux distributions it should already come pre-installed. If it isn't room-assistant will warn you when starting. You can then install it with:

```shell
sudo apt-get install bluetooth bluez
```

If you want to run room-assistant without root privileges (as it is recommended) you also need to grant the correct permissions:

```shell
sudo setcap cap_net_raw+eip $(eval readlink -f `which hcitool`)
sudo setcap cap_net_admin+eip $(eval readlink -f `which hciconfig`)
```

### Running with Docker

This integration requires you to run room-assistant in the `host` network and the `NET_ADMIN` capability. In a docker-compose file you can set these things as shown in the following example.

```yaml
version: '3'
services:
  room-assistant:
  	image: mkerix/room-assistant
  	network_mode: host
    cap_add:
      - NET_ADMIN
```

## How it works

This integration assumes that you have loaded it and configured it in the same manner on all instances that you want to use for tracking. Every 6 seconds each instance in the cluster will be tasked with querying the signal strength of one of the configured devices. The resulting RSSI values are shared with all other instances, one of which keeps track of all device states.

Each configured device will create a sensor that has the name of the closest room-assistant instance as its state - or `not_home` if the device could not be found by any of them. The distance in the attributes of those sensors is the inverted signal strength value and does not actually represent any physical distance. It may also show negative numbers.

## Inquiries switch

Each instance running this integration will also create a switch for enabling or disabling Bluetooth inquiries. A disabled switch blocks all Bluetooth requests of the instance, which essentially means that your Bluetooth device won't be discovered by this instance anymore. It does not take the instance out of the rotation however, so the time to detection stays the same.

You could use this to reduce the resources used by room-assistant when you are certain nobody is home. Another example would be disabling the inquiries when you are asleep to save the batteries of your Bluetooth devices at night.

You can also use this feature to only trigger scans when you are certain that some change has happened, e.g. whenever a motion sensor was triggered. In that case you would need to enable the `preserveState` setting to still get accurate results after turning the switch off again. Note that room-assistant internally sends out pseudo updates in that case, so the timestamps will update in the API even though no scans are happening.

## Troubleshooting

### Random incorrect not_home states

This happens when no measurements were collected for the device recently. To make the timeout a bit more lax and get rid of these incorrect states you can raise the `timeoutCycles` value. Note that this will also delay your device being reported as `not_home` when it really has gone away.

### WiFi/Bluetooth interference

Bluetooth uses the 2.4 GHz band, which may also be used by some of your other WiFi devices. This can cause interferences. Some Bluetooth devices may also handle a too aggressive refresh interval badly. If you are noticing any issues (e.g. WiFi devices dropping off the network, Bluetooth headphones disconnecting randomly) try raising the `interval` a bit. Note that this will also make the state updates a bit slower.

### Slow/unresponsive device over SSH

On some Single Board computers, such as the Raspberry Pis with integrated Wifi/BT, Bluetooth and WiFi are on a shared chip and antenna. If Bluetooth communication is happening the chip will temporarily shutdown WiFi packets until it is done, then switch back. Only one protocol is active at the same time, which can lead to request timeouts and delays in packets: if the the device is pinged at the wrong time, it won't accept a connection, and thus will time out. It will also lead to sluggish SSH sessions occasionally.

Why? The command used for polling takes about 5.5s overall, most of which are Bluetooth communication. If all allowlisted devices are away the SBC essentially only has about 1s of the 6s interval available for WiFi communication. If devices are near the effects are much less noticeable, as the polling finishes quickly and unlocks the chip for WiFi communication.

If you don't have anything else running on the Pis this shouldn't be much of an issue - room-assistant can handle the harsh network conditions. If you want the Pis to be more responsive and/or run other applications on them, currently there is only one solution that will do the trick: increase the interval. Keep in mind this also slows down the detection a bit.

[See here for the original issue context where this was discussed.](https://github.com/mKeRix/room-assistant/issues/178)

### Apple Watch not being detected

Try to pair your Apple Watch to a Bluetooth device such as headphones/speakers first, then add it to room-assistant for detection. You may unpair the peripheral after the watch has been detected by room-assistant.

## Settings

| Name                     | Type                                         | Default | Description                                                  |
| ------------------------ | -------------------------------------------- | ------- | ------------------------------------------------------------ |
| `addresses`              | Array                                        |         | List of Bluetooth MAC addresses that should be tracked. You can usually find them in the device settings. |
| `minRssi`                | Number _or_ [detailed config](#minimum-rssi) |         | Limits the RSSI at which a device is still reported if configured. Remember, the RSSI is the inverse of the sensor attribute distance, so for a cutoff at 10 you would configure -10. |
| `rssiFactor`             | Number                                       | `1`     | Multiplier for the measured RSSI values. Allows you to fine-tune measurements if you use different Bluetooth adapters across your cluster. |
| `hciDeviceId`            | Number                                       | `0`     | ID of the Bluetooth device to use for the inquiries, e.g. `0` to use `hci0`. |
| `interval`               | Number                                       | `10`    | The interval at which the Bluetooth devices are queried in seconds. |
| `scanTimeLimit`          | Number                                       | `6`     | The maximum time allowed for completing a device query in seconds. This should be set lower than the interval. |
| `timeoutCycles`          | Number                                       | `2`     | The number of completed query cycles after which collected measurements are considered obsolete. The timeout in seconds is calculated as `max(addresses, clusterDevices) * interval * timeoutCycles`. |
| `preserveState`          | Boolean                                      | `false` | Whether the last recorded distance should be preserved when the inquiries switch is turned off or not. |
| `inquireFromStart`       | Boolean                                      | `true`  | Whether the [Inquiries Switch](#inquiries-switch) is turned on when room-assistant is started or not. |
| `entityOverrides`        | [Entity Overrides](#entity-overrides)        |         | Allows you to override some properties of the created entities. |
| `kalmanProcessNoise`     | Number                                       | `1.4`   | Covariance of the process noise, used for measurement noise reduction via a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter). |
| `kalmanMeasurementNoise` | Number                                       | `1`     | Covariance of the measurement noise, used for measurement noise reduction via a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter). |

### Minimum RSSI

`minRssi` can either be specified as a number that is applied to all devices like shown in the simple example config, or as a map of addresses and `minRssi` values as shown in the advanced example config. The latter allows you to configure different cutoffs for the devices you are using, as they may end up showing different RSSI levels even when placed at the same distance. The `minRssi.default` setting will be applied to all addresses that have not been configured specifically. If it is not set, all devices that don't have a specific value will always be considered to be in range.

### Entity Overrides

The entity overrides object can be considered as a map with the device MAC as key and an object with some of the following settings as value.

| Name   | Type   | Default | Description                                                  |
| ------ | ------ | ------- | ------------------------------------------------------------ |
| `id`   | String |         | Changes the ID of the device entities. Useful to hide device addresses from publicly shared home automation configurations. |
| `name` | String |         | Changes the friendly name for the device, which is sent to the home automation software for easier identification. |

::: details Simple Example Config

```yaml
global:
  integrations:
    - bluetoothClassic
bluetoothClassic:
  minRssi: -20
  addresses:
    - '08:05:90:ed:3b:60'
    - '77:50:fb:4d:ab:70'
```
:::

::: details Advanced Example Config

```yaml
global:
  integrations:
    - bluetoothClassic
bluetoothClassic:
  hciDeviceId: 1
  interval: 20
  timeoutCycles: 2.5
  minRssi:
    '08:05:90:ed:3b:60': -10
    default: -20
  addresses:
    - '08:05:90:ed:3b:60'
    - '77:50:fb:4d:ab:70'
  entityOverrides:
    '08:05:90:ed:3b:60':
    	id: my-phone
    	name: My Phone
```

:::
