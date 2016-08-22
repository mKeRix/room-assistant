# room-assistant #

room-assistant is a simple Node.js server for tracking presence and other things on a per-room basis.
Currently it is mainly meant to be used for the [mqtt_room](https://home-assistant.io/components/sensor.mqtt_room/) component of [Home Assistant](https://home-assistant.io/).

## Installation ##

Before you continue please make sure that you have the [latest version of Node.js installed](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions), as the Raspbian by default provides is very old.
You also need to install some more dependencies by running this command:

```
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev libusb-1.0-0-dev
```

Now you can install room-assistant into a directory of your choice:

```
git clone https://github.com/mKeRix/room-assistant.git
cd room-assistant
npm install
```

And run it to see if everything went fine:

```
npm start
```

## Configuration ##

To configure room-assistant you should make a copy of the `config/default.json` file and name it `local.json`.
The `default.json` should not be edited directly as these changes will be overwritten on an update.

```
cp config/default.json config/local.json
nano config/local.json
```

All options are stored within these configuration files. They are sorted by components and already set to sensible defaults.
You need to enable every needed component manually.

### Publishers ###

Publishers are how room-assistant sends its data around. Currently only one publisher at a time is supported.

#### MQTT ###

You need to have a valid MQTT server for this component to work.

```json
{
  "mqtt": {
    "enabled": true,
    "url": "mqtts://mqttserver:1234",
    "username": "",
    "password": "",
    "topic": "room-name"
  }
}
```

Options:

- **enabled** - enable or disable the component
- **url** - URL to your MQTT server, this works with the protocols 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss'
- **username** - username (please create a new user for each client/room)
- **password** - password
- **topic** - a topic name to uniquely identify each client/room

### Trackers ###

#### Bluetooth LE Beacons ####

This component tracks all BLE beacons it finds and posts updates about them including a calculated their id, name, signal strength and a calculated distance.
The distance calculation is optimized for the iBeacon standard. To avoid faulty data through noise the distance values are smoothed using the [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter).

On Linux this component will have to run as root [unless you set the correct permissions](https://github.com/sandeepmistry/noble#running-on-linux).

```json
{
  "ble": {
    "enabled": true,
    "channel": "room_presence",
    "max_distance": 0,
    "whitelist": ["id1", "id2"]
  }
}
```

Options:

- **enabled** - enable or disable component
- **channel** - channel for the announcements about found beacons
- **max_distance** - maximum distance where the scanner will still send the data to a publisher, 0 means unlimited
- **whitelist** - array of Bluetooth IDs as whitelist for updates that should be sent to the publisher, an empty list disables the whitelist

#### Temper USB Sensors ####

This component is meant to be used for the cheap Temper USB dongles. They read the temperature and humidity values.

On Linux this component will have to run as root [unless you set the correct permissions](https://github.com/padelt/temper-python#usb-device-permissions).

```json
{
  "temper": {
    "enabled": true,
    "channel": "temper",
    "interval": 60000,
    "scale": 1,
    "offset": 0
  }
}
```

Options:

- **enabled** - enable or disable component
- **channel** - channel for sensor value updates
- **interval** - the interval in which the sensor should be checked in milliseconds
- **scale** - the temperature output is calculated as `scale * value + offset`, this allows you to fine-tune the sensor
- **offset** - see scale

## Running as a service ##

To make sure your room-assistant is always running you should setup a service for it. Luckily there are two cool packages that help us do this:

```
sudo npm install -g forever forever-service
```

From your room-assistant directory you can then simply run the following command to register a new service:

```
sudo forever-service install -s index.js -e "ENV=prod" --start room-assistant
```


## Contributing ##

I started this project mainly to augment my own home automation with Raspberry Pi 3 beacons in each room.
This was my solution for being too lazy for turning on the lights and heating per room as I come and go.
If this is of any use to you - cool! If you want to add some code - even cooler! Just create a ticket or a pull request.
There currently are no specific criteria to meet as long as you follow the basic principles demonstrated in the exiisting components.
And if you can add unit tests too, even if my work on that hasn't gotten far yet.
