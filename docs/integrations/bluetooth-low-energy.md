# Bluetooth Low Energy

**Integration Key:** `bluetoothLowEnergy`

The Bluetooth Low Energy (BLE) integration scans for advertisement packets that other devices, like iBeacon or Bluetooth tags, emit. You can use any of the many different BLE tags or smart armbands out there, as long as they send out a constant ID. An example would be the [RadBeacon Chip](https://store.radiusnetworks.com/collections/all/products/radbeacon-chip) or the [iB001W](https://www.beaconzone.co.uk/iB001W?search=iB001W). You can use Google or your favorite tech hardware store to find many other products like them that would also work.

The integration calculates an estimated distance in meters for all advertisements it receives and uses that to update the current location of the device. Since there are many factors at play these estimations are not exact measurements, especially once there are obstructions between the BLE device and room-assistant instance. The best accuracy can be achieved with properly configured iBeacons. The distance value is smoothed using a [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter) to limit the impact of measurement noise.

## Requirements

::: tip

Using this together with [Bluetooth Classic](./bluetooth-classic.md) on the same adapter works, but will slightly degrade the performance. If you encounter issues you can try to run to run the integrations from different HCI devices.

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
sudo setcap cap_net_admin+eip $(eval readlink -f `which hciconfig`)
```

### Running with Docker

This integration requires you to run room-assistant in the `host` network.

## Determining the IDs

In order to not clutter your home automation software with the many BLE devices broadcasting their status nearby, room-assistant requires you to set up a allowlist or denylist before it will pass on any information. For regular BLE devices this is the lowercase MAC address without `:`, for example `7750fb4dab70` for a peripheral with the MAC address `77:50:FB:4D:AB:70`. When using iBeacons the ID will be in the format of `uuid-major-minor`, for example `2f234454cf6d4a0fadf2f4911ba9ffa6-1-2`.

If you are unsure what ID your device has you can start room-assistant with the BLE integration enabled, but no allowlist. Devices that are seen for the first time after starting will be logged with their ID to the console.

## Tracking iOS Devices

::: tip

To use all features that the app offers you should be running room-assistant **v2.17.0** or higher.

:::

You can track iOS devices (iPhones, iPads) with this integration using our companion app. You will need to install the app, open it, grant the requested permissions and then follow the on-screen instructions.

[![Download on the App Store](./app-store-badge.svg)](https://apps.apple.com/us/app/room-assistant/id1538642237?itsct=apps_box_link&itscg=30200)

It is recommended to raise the `timeout` setting to at least `60` when using the companion app, as the signal may not always be constant.

You can turn on auto-toggling of this feature in the companion app, which will automatically turn off the trackable information when you are not in reach of any room-assistant instance. This feature requires "always" location permissions to work. It uses beacon advertisements emitted by room-assistant and does not grab your geo-location.

::: details Example Config

```yaml
bluetoothLowEnergy:
  timeout: 60
  allowlist:
  - 'UUID-LIKE-IN-THE-APP'
```

:::

## Settings

| Name              | Type                            | Default  | Description                                                  |
| ----------------- | ------------------------------- | -------- | ------------------------------------------------------------ |
| `allowlist`  | Array                           |          | A list of [BLE tag IDs](#determining-the-ids) that should be tracked. |
| `allowlistRegex` | Boolean                         | `false`  | Whether the allowlist should be evaluated as a list of [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) or not. |
| `denylist`  | Array                           |          | A list of [BLE tag IDs](#determining-the-ids) that should not be tracked. If an ID matches both allowlist and denylist it will not be tracked. |
| `denylistRegex` | Boolean                         | `false`  | Whether the denylist should be evaluated as a list of [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) or not. |
| `processIBeacon`  | Boolean                         | `true`   | Whether additional data from iBeacon devices should be taken into account or not. Affects tag IDs and distance estimation. |
| `onlyIBeacon`     | Boolean                         | `false`  | Whether only iBeacons should be considered when scanning for devices ot not. |
| `timeout`         | Number                          | `60`    | The time after which a recorded distance is considered outdated. This value should be higher than the advertisement frequency of your peripheral. |
| `updateFrequency` | Number                          | `0`      | Minimum amount of seconds that should be waited between distance updates for each tag. The default value disables the throttling. |
| `maxDistance`     | Number                          |          | Limits the distance at which a received BLE advertisement is still reported if configured. Value is in meters. |
| `rssiFactor` | Number | `1` | Multiplier for the measured RSSI values. Allows you to fine-tune measurements if you use different Bluetooth adapters across your cluster. |
| `majorMask`       | Number                          | `0xffff` | Filter out bits of the major ID to make dynamic tag IDs with encoded information consistent for filtering. |
| `minorMask`       | Number                          | `0xffff` | Filter out bits of the minor ID to make dynamic tag IDs with encoded information consistent for filtering. |
| `batteryMask`     | Number                          | `0x00000000` | If non-zero, extract the beacon's battery level from the major/minor fields. The mask operates on a 32bit value with major as the high two bytes and minor as the low two bytes. |
| `tagOverrides`    | [Tag Overrides](#tag-overrides) |          | Allows you to override some properties of the tracked devices. |
| `hciDeviceId`     | Number                          | `0`      | ID of the Bluetooth device to use for the inquiries, e.g. `0` to use `hci0`. |
| `instanceBeaconEnabled` | Boolean | `true` | Whether this instance should emit iBeacon advertisements via BLE, which can be used by the room-assistant companion app to auto-toggle advertising. |
| `instanceBeaconMajor` | Number | `1` | The major of the advertised iBeacon. |
| `instanceBeaconMinor` | Number | Random | The minor of the advertised iBeacon. |
| `minDiscoveryLogRssi` | Number | -999 | Only log newly discovered beacons if raw RSSI values are grerater than this (usefull to reduce log spam if on a busy street). |

### Tag Overrides

The tag overrides object can be considered as a map with the BLE tag ID as key and an object with some of the following settings as value.

| Name            | Type   | Default | Description                                                                                                                                                                                                                                                                                                                             |
| --------------- | ------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id` | String |  | Changes the ID of the device within room-assistant, which is used for entity ID generation. Useful to hide peripheral addresses from publicly shared home automation configurations. |
| `name`          | String |         | Sets a friendly name for the device, which is sent to the home automation software for easier identification.                                                                                                                                                                                                                           |
| `measuredPower` | Number |         | Overrides the [measured power](https://community.estimote.com/hc/en-us/articles/201636913-What-are-Broadcasting-Power-RSSI-and-other-characteristics-of-a-beacon-s-signal-) of a BLE tag, which is used for distance calculation. Should be the expected RSSI when the beacon is exactly 1 meter away from the room-assistant instance. |
| `batteryMask`       | Number                          | `0x00000000` | If non-zero, extract the beacon's battery level from the major/minor fields. The mask operates on a 32bit value with major as the high two bytes and minor as the low two bytes. |

::: details Example Config
```yaml
global:
  integrations:
    - bluetoothLowEnergy
bluetoothLowEnergy:
  allowlist:
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
  allowlist:
    - 7750fb4dab70
    - 2f234454cf6d4a0fadf2f4911ba9ffa6-1-2
```
:::
