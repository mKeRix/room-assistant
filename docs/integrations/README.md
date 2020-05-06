# Overview

room-assistant ships with multiple integrations that you can pick and choose from to get the functionality that you require. You enable the components by adding their respective integration keys to the `global.integrations` list.

## Home Automation

| Integration                           | Supported entities |
| ------------------------------------- | ------------------ |
| [Home Assistant](./home-assistant.md) | All                |

## Presence Detection

| Integration                                       | Refresh rate | Provided data        | Distributed |
| ------------------------------------------------- | ------------ | -------------------- | ----------- |
| [Bluetooth Low Energy](./bluetooth-low-energy.md) | up to 100ms  | Location, distance   | Yes         |
| [Bluetooth Classic](./bluetooth-classic.md)       | 6s           | Location             | Yes         |
| [Omron D6T](./omron-d6t.md)                       | 250ms        | Locations within FOV | No          |
| [Grid-EYE](./grid-eye.md)                         | 1s           | Locations within FOV | No          |

## Other

| Integration         | Supported entities |
| ------------------- | ------------------ |
| [GPIO](./gpio.md)   | Binary sensors     |
| [Shell](./shell.md) | Binary sensors     |
| [Xiaomi Mi](./xiaomi-mi.md) | Temperature, humidity, etc sensors |

