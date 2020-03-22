# Bluetooth Classic

**Integration Key:** `bluetoothClassic`

::: warning

Using this together with [Bluetooth Low Energy](./bluetooth-low-energy) requires multiple Bluetooth adapters.

:::

The Bluetooth Classic integration can detect the location of any Bluetooth device within the home. It does this by sending out connection requests to the device addresses you configure on rotation and then checking the signal strength of the response. The configured Bluetooth devices do not do not need to be paired with your machines running room-assistant.

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

## Troubleshooting

### Random incorrect not_home states

This happens when no measurements were collected for the device recently. To make the timeout a bit more lax and get rid of these incorrect states you can raise the `timeoutCycles` value. Note that this will also delay your device being reported as `not_home` when it really has gone away.

### WiFi/Bluetooth interference

Bluetooth uses the 2.4 GHz band, which may also be used by some of your other WiFi devices. This can cause interferences. Some Bluetooth devices may also handle a too aggressive refresh interval badly. If you are noticing any issues (e.g. WiFi devices dropping off the network, Bluetooth headphones disconnecting randomly) try raising the `interval` a bit. Note that this will also make the state updates a bit slower.

## Settings

| Name            | Type   | Default | Description                                                  |
| --------------- | ------ | ------- | ------------------------------------------------------------ |
| `addresses`     | Array  |         | List of Bluetooth MAC addresses that should be tracked. You can usually find them in the device settings. |
| `minRssi`       | Number |         | Limits the RSSI at which a device is still reported if configured. Remember, the RSSI is the inverse of the sensor attribute distance, so for a cutoff at 10 you would configure -10. |
| `hciDeviceId`   | Number | 0       | ID of the Bluetooth device to use for the inquiries, e.g. `0` to use `hci0`. |
| `interval`      | Number | 6       | The interval at which the Bluetooth devices are queried in seconds. |
| `timeoutCycles` | Number | 2       | The number of completed query cycles after which collected measurements are considered obsolete. The timeout in seconds is calculated as `max(addresses, clusterDevices) * interval * timeoutCycles`. |

::: details Example Config
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
