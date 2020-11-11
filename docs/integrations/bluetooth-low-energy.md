# Bluetooth Low Energy

**Integration Key:** `bluetoothLowEnergy`

The Bluetooth Low Energy (BLE) integration scans for advertisement packets that other devices, like iBeacon or Bluetooth tags, emit. You can use any of the many different BLE tags or smart armbands out there, as long as they send out a constant ID. An example would be the [RadBeacon Chip](https://store.radiusnetworks.com/collections/all/products/radbeacon-chip) or the [iB001W](https://www.beaconzone.co.uk/iB001W?search=iB001W). You can use Google or your favorite tech hardware store to find many other products like them that would also work.

The integration calculates an estimated distance in meters for all advertisements it receives and uses that to update the current location of the device. Since there are many factors at play these estimations are not exact measurements, especially once there are obstructions between the BLE device and room-assistant instance. The best accuracy can be achieved with properly configured iBeacons. The distance value is smoothed using a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter) to limit the impact of measurement noise.

## Requirements

::: tip

Using this together with [Bluetooth Classic](./bluetooth-classic) on the same adapter works, but will slightly degrade the performance. If you encounter issues you can try to run to run the integrations from different HCI devices.

:::

This integration requires a BLE capable Bluetooth adapter. Most modern boards like the Raspberry Pi Zero W have an integrated adapter that is suitable. Any Bluetooth USB stick with BLE and Linux support should also work.

### Running with NodeJS

Apart from that you are also required to have a few more system packages installed:

```shell
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
sudo npm i --global --unsafe-perm room-assistant
```

If you want to run room-assistant without root privileges (as it is recommended) you also need to give NodeJS the correct permissions:

```shell
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

### Running with Docker

This integration requires you to run room-assistant in the `host` network.

## Determining the IDs

In order to not clutter your home automation software with the many BLE devices broadcasting their status nearby, room-assistant requires you to set up a whitelist or blacklist before it will pass on any information. For regular BLE devices this is the lowercase MAC address without `:`, for example `7750fb4dab70` for a peripheral with the MAC address `77:50:FB:4D:AB:70`. When using iBeacons the ID will be in the format of `uuid-major-minor`, for example `2f234454cf6d4a0fadf2f4911ba9ffa6-1-2`.

If you are unsure what ID your device has you can start room-assistant with the BLE integration enabled, but no whitelist. Devices that are seen for the first time after starting will be logged with their ID to the console.

## Settings

| Name              | Type                            | Default  | Description                                                  |
| ----------------- | ------------------------------- | -------- | ------------------------------------------------------------ |
| `whitelist`       | Array                           |          | A list of [BLE tag IDs](#determining-the-ids) that should be tracked. |
| `whitelistRegex`  | Boolean                         | `false`  | Whether the whitelist should be evaluated as a list of [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) or not. |
| `blacklist`       | Array                           |          | A list of [BLE tag IDs](#determining-the-ids) that should not be tracked. If an ID matches both whitelist and blacklist it will not be tracked. |
| `blacklistRegex`  | Boolean                         | `false`  | Whether the blacklist should be evaluated as a list of [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) or not. |
| `processIBeacon`  | Boolean                         | `true`   | Whether additional data from iBeacon devices should be taken into account or not. Affects tag IDs and distance estimation. |
| `onlyIBeacon`     | Boolean                         | `false`  | Whether only iBeacons should be considered when scanning for devices ot not. |
| `timeout`         | Number                          | `5`      | The time after which a recorded distance is considered outdated. This value should be higher than the advertisement frequency of your peripheral. |
| `updateFrequency` | Number                          | `0`      | Minimum amount of seconds that should be waited between distance updates for each tag. The default value disables the throttling. |
| `maxDistance`     | Number                          |          | Limits the distance at which a received BLE advertisement is still reported if configured. Value is in meters. |
| `majorMask`       | Number                          | `0xffff` | Filter out bits of the major ID to make dynamic tag IDs with encoded information consistent for filtering. |
| `minorMask`       | Number                          | `0xffff` | Filter out bits of the minor ID to make dynamic tag IDs with encoded information consistent for filtering. |
| `batteryMask`     | Number                          | `0x00000000` | If non-zero, extract the beacon's battery level from the major/minor fields. The mask operates on a 32bit value with major as the high two bytes and minor as the low two bytes. |
| `tagOverrides`    | [Tag Overrides](#tag-overrides) |          | Allows you to override some properties of the tracked devices. |
| `hciDeviceId`     | Number                          | `0`      | ID of the Bluetooth device to use for the inquiries, e.g. `0` to use `hci0`. |

### Tag Overrides

The tag overrides object can be considered as a map with the BLE tag ID as key and an object with some of the following settings as value.

| Name            | Type   | Default | Description                                                                                                                                                                                                                                                                                                                             |
| --------------- | ------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | String |         | Sets a friendly name for the device, which is sent to the home automation software for easier identification.                                                                                                                                                                                                                           |
| `measuredPower` | Number |         | Overrides the [measured power](https://community.estimote.com/hc/en-us/articles/201636913-What-are-Broadcasting-Power-RSSI-and-other-characteristics-of-a-beacon-s-signal-) of a BLE tag, which is used for distance calculation. Should be the expected RSSI when the beacon is exactly 1 meter away from the room-assistant instance. |
| `batteryMask`       | Number                          | `0x00000000` | If non-zero, extract the beacon's battery level from the major/minor fields. The mask operates on a 32bit value with major as the high two bytes and minor as the low two bytes. |

::: details Example Config
```yaml
global:
  integrations:
    - bluetoothLowEnergy
bluetoothLowEnergy:
  whitelist:
    - 7750fb4dab70
    - 2f234454cf6d4a0fadf2f4911ba9ffa6-1-2
  maxDistance: 7
  tagOverrides:
    7750fb4dab70:
      name: Cool BLE Tag
      measuredPower: -61
      batteryMask: 0x0000FF00
```
:::

::: details Multiple Bluetooth Integrations Example Config

`hciDeviceId` can be used to choose a different Bluetooth adapter than the default one. Use hciconfig from the command line to see all available Bluetooth adapters. This may be useful when using Bluetooth Classic and Bluetooth Low Energy at the same time, as you could then have BLE passive scanning enabled at all times instead of just when no Bluetooth Classic inquiry is running.

```yaml
global:
  integrations:
    - bluetoothClassic
    - bluetoothLowEnergy
bluetoothClassic:
  hciDeviceId: 0
  addresses:
    - '08:05:90:ed:3b:60'
    - '77:50:fb:4d:ab:70'
bluetoothLowEnergy:
  hciDeviceId: 1
  whitelist:
    - 7750fb4dab70
    - 2f234454cf6d4a0fadf2f4911ba9ffa6-1-2
```
:::
