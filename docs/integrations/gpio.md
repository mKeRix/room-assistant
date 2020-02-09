# GPIO

The [general-purpose input/output](https://en.wikipedia.org/wiki/General-purpose_input/output) (GPIO) integration allows you to integrate devices that are directly connected to GPIO pins, for example [PIR motion sensors](https://en.wikipedia.org/wiki/Passive_infrared_sensor). It makes uses of the [GPIO Sysfs Interface](https://www.kernel.org/doc/Documentation/gpio/sysfs.txt) and therefore only works on Linux.

## Requirements

The user under which room-assistant is running needs to have access to the GPIO pins. Under Raspbian this can be granted by adding the user to the `gpio` group:

```shell
sudo adduser $USER gpio
```

## Settings

| Name            | Type                                   | Default | Description                            |
| --------------- | -------------------------------------- | ------- | -------------------------------------- |
| `binarySensors` | [GPIO Binary Sensors](#binary-sensors) |         | Array of binary sensor configurations. |

### Binary Sensors

| Name          | Type   | Default | Description                                                  |
| ------------- | ------ | ------- | ------------------------------------------------------------ |
| `name`        | String |         | Friendly name for this sensor.                               |
| `pin`         | Number |         | Number of the GPIO pin that should be tracked.               |
| `deviceClass` | String |         | Home Assistant [device class](https://www.home-assistant.io/integrations/binary_sensor/#device-class) that the sensor should be shown as. |

::: details Example Config

```yaml
global:
  integrations:
    - gpio
gpio:
  binarySensors:
    - name: Bedroom Motion Sensor
      pin: 17
      deviceClass: motion
```

:::

