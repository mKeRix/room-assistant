# Bluetooth Classic

**Integration Key:** `bluetoothClassic`

::: warning

This integration cannot be used together with [Bluetooth Low Energy](./bluetooth-low-energy).

:::

The Bluetooth Classic integration can detect the location of any Bluetooth device within the home. It does this by sending out connection requests to the device addresses you configure on rotation and then checking the signal strength of the response. The configured Bluetooth devices do not do not need to be paired with your machines running room-assistant.

The integration has been tested to work great with the Apple Watch. You may see a minor hit on the battery life of the Bluetooth devices when enabling this.

## Requirements

This integration only works on Linux, as it depends on `hcitool`. On most Linux distributions it should already come pre-installed. If it isn't room-assistant will warn you when starting. You can then install it with:

```shell
sudo apt-get install bluetooth bluez
```

If you want to run room-assistant without root privileges (as it is recommended) you also need to grant the correct permissions:

```shell
sudo setcap cap_net_raw+eip $(eval readlink -f `which hcitool`)
```

## How it works

This integration assumes that you have loaded it and configured it in the same manner on all instances that you want to use for tracking. Every 6 seconds each instance in the cluster will be tasked with querying the signal strength of one of the configured devices. The resulting RSSI values are shared with all other instances, one of which keeps track of all device states.

Each configured device will create a sensor that has the name of the closest room-assistant instance as its state - or `not_home` if the device could not be found by any of them. The distance in the attributes of those sensors is the inverted signal strength value and does not actually represent any physical distance. It may also show negative numbers.

## Inquiries switch

Each instance running this integration will also create a switch for enabling or disabling Bluetooth inquiries. A disabled switch blocks all Bluetooth requests of the instance, which essentially means that your Bluetooth device won't be discovered by this instance anymore. It does not take the instance out of the rotation however, so the time to detection stays the same.

You could use this to reduce the resources used by room-assistant when you are certain nobody is home. Another example would be disabling the inquiries when you are asleep to save the batteries of your Bluetooth devices at night. 

## Settings

| Name        | Type   | Default | Description                                                  |
| ----------- | ------ | ------- | ------------------------------------------------------------ |
| `addresses` | Array  |         | List of Bluetooth MAC addresses that should be tracked. You can usually find them in the device settings. |
| `minRssi`   | Number |         | Limits the RSSI at which a device is still reported if configured. Remember, the RSSI is the inverse of the sensor attribute distance, so for a cutoff at 10 you would configure -10. |

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
