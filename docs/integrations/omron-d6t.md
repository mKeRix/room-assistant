# Omron D6T

**Integration Key:** `omronD6t`

The [Omron D6T line](https://omronfs.omron.com/en_US/ecb/products/pdf/en-d6t.pdf) of thermopile sensors measure a matrix of temperatures in front of their lenses and can be used to detect human presence, even when stationary. This is done by analyzing the temperature readings for localized peaks, i.e. certain spots have a notably higher temperature than the rest.

This integration will provide a sensor that contains a count of people in the room. It also includes their coordinates (relative to the sensor view) in the sensor attributes. Note that due to the low resolution of the D6T sensors multiple people can only be recognized as such if they are positioned at different ends of the sensor field of view.

## Requirements

::: tip

Omron D6T hardware needs to be hooked up with JST connectors, for which you cannot buy fitting pre-made cables that work with the GPIO pins found on most Linux boards. You will have to crimp your own cables to get this working - so don't forget to also buy the necessary parts for the cable when purchasing the sensor. 

:::

This integration only supports the D6T-44L-06 sensor at the moment. You will need to connect it to the I2C pins on your machine. On Raspberry Pi devices the I<sup>2</sup>C interface also needs to be enabled using `sudo raspi-config` and then enabling the I<sup>2</sup>C option under Advanced Options.

## Sensor placement

When placing your sensor you need to consider a few factors to get reliable results:

- Don't face the sensor towards a source of heat that is less than 5 meters away, for example radiators or windows.
- Make sure the sensor has a clear view of all areas that you want to track.
- Consider the range of the sensor, the further away people are the harder it will be to reliably detect them. Up to 5 meters of detection radius are realistic.
- Consider the field of view as stated in the datasheet.

## Settings

| Name             | Type   | Default | Description                                                  |
| ---------------- | ------ | ------- | ------------------------------------------------------------ |
| `busNumber`      | Number | `1`     | I<sup>2</sup>C bus number of your machine that the sensor is connected to. |
| `address`        | Number | `0x0a`  | I<sup>2</sup>C address of the D6T sensor that you want to use. |
| `deltaThreshold` | Number | `1.5`   | Minimum temperature difference between average and single temperature pixel in &deg;C for it to be considered as human presence. Increase if you are seeing false positives, decrease if you are seeing false negatives. |

::: details Example Config

```yaml
global:
  integrations:
    - omronD6t
omronD6t:
  deltaThreshold: 2
```

:::