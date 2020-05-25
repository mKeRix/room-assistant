# Xiaomi Mi Sensors

**Integration Key:** `xiaomiMi`

::: warning

Using this together with [Bluetooth Classic](./bluetooth-classic) requires multiple Bluetooth adapters.
Using this together with [Bluetooth Low Energy](./bluetooth-low-energy)
requires that the hciDeviceId settings of both integrations are the same value.

:::

The Xiaomi Mi integration scans for Bluetooth Low Engery (BLE) advertisements from a variety of Xiaomi sensors.
Sensor readings can then be published to MQTT using the [Home Assistant integration](./home-assistant).

## Requirements

This integration has all the same requirements as the [Bluetooth Low Energy](./bluetooth-low-energy) integration.

## Supported devices

This integration has been tested with these devices:

- LYWSD02

  (rectangular body, E-Ink, broadcasts temperature and humidity, about 20 readings per minute, no battery info)

- LYWSDCGQ

  (circular body, segment LCD, broadcasts temperature and humidity when it changes (and possibly periodically) and battery level once in an hour)
 
- LYWSD03MMC

  (small square body, segment LCD, broadcasts temperature and humidity once in about 10 minutes and battery level once in an hour, advertisements are encrypted, therefore you need to set the key in your configuration, see for instructions the [bindKey](#sensor-options) option)

## Settings

| Name              | Type                              | Default  | Description                     |
| ----------------- | --------------------------------- | -------- | ------------------------------- |
| `sensors`         | [Sensor options](#sensor-options) |          | An array of sensor definitions. |
| `hciDeviceId`     | Number                            | `0`      | Bluetooth Device ID (e.g. `0` to use `hci0`). |

### Sensor Options

| Name              | Type   | Default  | Description                                                            |
| ----------------- | ------ | -------- | ---------------------------------------------------------------------- |
| `name`            | string |          | A human readable name for the sensor. Will be used in MQTT topics.     |
| `address`         | string |          | MAC address of the device ([Format](#address-format)).                 |
| `bindKey`         | string |          | A decryption key for sensors which send [encrypted data](#encryption). |

### Address Format

The `address` field is a lowercase MAC address without `:`.  This is the same format as a [tag ID](./bluetooth-low-energy#determining-the-ids) in the BLE integration. The BLE integration can also be used to log device IDs to the console.

## Encryption

Some Xiaomi sensors encrypted their data (e.g. LYWSD03MMC). To be able to read the data from this sensor one needs to get a hold of the encryption key. For ways to get this key please read this [this FAQ entry](https://github.com/custom-components/sensor.mitemp_bt/blob/master/faq.md#my-sensors-ble-advertisements-are-encrypted-how-can-i-get-the-key) from the [custom-components/sensor.mitemp_bt](https://github.com/custom-components/sensor.mitemp_bt/) repository.  Once found, it can be set with the [bindKey](#sensor-options) option.

## See also

There are many projects dedicated to these devices.  This integration has particularly benefited from these two:

- [Homebridge plugin](https://github.com/hannseman/homebridge-mi-hygrothermograph).  Much of the parser code came from this project.
- [mitemp_bt](https://github.com/custom-components/sensor.mitemp_bt/).  One of the better documented projects with extensive device support.
