# room-assistant [![Build Status](https://travis-ci.org/mKeRix/room-assistant.svg?branch=master)](https://travis-ci.org/mKeRix/room-assistant)

room-assistant is a simple Node.js server for tracking presence and other things on a per-room basis.
Currently it is mainly meant to be used for the [mqtt_room](https://home-assistant.io/components/sensor.mqtt_room/) component of [Home Assistant](https://home-assistant.io/).

## Usage
### Runing with node.js
#### Installation
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

#### Execution
Run it to see if everything went fine:
```
npm start
```

##### Running as a service
To make sure your room-assistant is always running you should setup a service for it. This can be done easily on newer systems using systemd.

Create the file `/etc/systemd/system/room-assistant.service` with your favorite editor:

```
sudo nano /etc/systemd/system/room-assistant.service
```

Fill the file with the following data, adjusting the values as needed:

```
[Unit]
Description=Room Assistant service

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/pi/room-assistant
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save the file, then enable and start the service using the following commands:

```
sudo systemctl enable room-assistant.service
sudo systemctl start room-assistant.service
```

You can now check the service status by running:

```
systemctl status room-assistant.service
```

#### Updating
Updating is easy, just pull the new version from Github and check if the dependencies are uptodate:

```
git pull
npm install
```


### Running with Docker
#### Execution
* This image only works on the _host_ network.
* To add your configuration files, you need to
  * create a directory on your host (e.g. ~/room-assistant/config)
  * add your configuration files under it
  * mount this directory to the /room-assistant/config/ directory on the container.

Example:
```
docker run --network=host -d --name room-assistant -v ~/room-assistant/config:/room-assistant/config mkerix/room-assistant:latest-rpi
```

## Configuration
To configure room-assistant you should make a copy of the `config/default.json` file and name it `local.json`.
The `default.json` should not be edited directly as these changes will be overwritten on an update.

```
cp config/default.json config/local.json
nano config/local.json
```

All options are stored within these configuration files. They are sorted by components and already set to sensible defaults.
You need to enable every needed component manually.

Available global app options:
- **unsafe** - catch all exceptions thrown and keep running anyway (keep this on false unless you read otherwise in the Github issue for your problem!)
- **logging** - whether to store logs on the filesystem or not

### Publishers
Publishers are how room-assistant sends its data around. Currently only one publisher at a time is supported.

#### MQTT
You need to have a valid MQTT server for this component to work.

```json
{
  "mqtt": {
    "enabled": true,
    "url": "mqtts://mqttserver:1234",
    "username": "",
    "password": "",
    "reject_unauthorized": true,
    "topic": "room-name"
  }
}
```

Options:
- **enabled** - enable or disable the component
- **url** - URL to your MQTT server, this works with the protocols 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss'
- **username** - username (please create a new user for each client/room)
- **password** - password
- **reject_unauthorized** - set this to `false` to allow self signed certificates
- **topic** - a topic name to uniquely identify each client/room

#### Console
This component is meant to be used for testing and just outputs everything to the console.

```json
{
  "console": {
    "enabled": true
  }
}
```

Options:
- **enabled** - enable or disable the component

### Trackers
#### Bluetooth LE Beacons
This component tracks all BLE beacons it finds and posts updates about them including a calculated their id, name, signal strength and a calculated distance.
The distance calculation is optimized for the iBeacon standard and in meters. To avoid faulty data through noise the distance values are smoothed using the [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter).

In additional the list of supported devices found [here](https://github.com/sandeepmistry/noble/wiki/Compatible-Devices) I have also tested this component with a variety of virtual iBeacon apps and the [RadBeacon Dot](http://store.radiusnetworks.com/collections/all/products/radbeacon-dot).

A note on whitelist/blacklist precedence: when an id is detected and the id is on the whitelist, it is always sent to the configured publishers. If it is not on the whitelist or the whitelist is empty, the blacklist is checked. If the id is then found on the blacklist, it will not be published. If both blacklist and whitelist are empty, all detected ids are published.

On Linux this component will have to run as root [unless you set the correct permissions](https://github.com/sandeepmistry/noble#running-on-linux).
```json
{
  "ble": {
    "enabled": true,
    "channel": "room_presence",
    "max_distance": 0,
    "whitelist": ["id1", "id2"],
    "blacklist": ["id3", "id4"],
    "use_mac": false,
    "system_noise": 0.01,
    "measurement_noise": 3,
    "update_frequency": 0
  }
}
```

Options:
- **enabled** - enable or disable component
- **channel** - channel for the announcements about found beacons
- **max_distance** - maximum distance in meters where the scanner will still send the data to a publisher, 0 means unlimited
- **whitelist** - array of Bluetooth IDs as whitelist for updates that should be sent to the publisher, an empty list disables the whitelist 
- **blacklist** - array of Bluetooth IDs as blacklist for updates that should not be sent to the publisher, an empty list disables the blacklist 
- **use_mac** - publish the Bluetooth MAC address instead of the UUID (for devices without a consistent UUID)
- **system_noise** - describes how noisy the system is and should be kept relatively low (used for the Kalman filter)
- **measurement_noise** - describes how noisy the measurements are (used for the Kalman filter)
- **update_frequency** - in milliseconds, limits how often the component sends updates to not "spam" the publisher, 0 disables the check and is the default


#### iBeacons
This component tracks only the iBeacons it finds and posts updates about them including a calculated their id, name, signal strength and a calculated distance in meters.
To avoid faulty data through noise the distance values are smoothed using the [Kalman filter](https://en.wikipedia.org/wiki/Kalman_filter).
The iBeacon component is mostly useful if you want to address your beacons via the major minor system or if the BLE component did not work correctly with your hardware.

A note on whitelist/blacklist precedence: when an id is detected and the id is on the whitelist, it is always sent to the configured publishers. If it is not on the whitelist or the whitelist is empty, the blacklist is checked. If the id is then found on the blacklist, it will not be published. If both blacklist and whitelist are empty, all detected ids are published.

On Linux this component will have to run as root [unless you set the correct permissions](https://github.com/sandeepmistry/noble#running-on-linux).
```json
{
  "ibeacon": {
    "enabled": true,
    "channel": "room_presence",
    "max_distance": 0,
    "whitelist": ["id1", "id2"],
    "use_mac": false,
    "system_noise": 0.01,
    "measurement_noise": 3,
    "major_mask": "0xFFFF",
    "minor_mask": "0xFFFF"
  }
}
```

Options:
- **enabled** - enable or disable component
- **channel** - channel for the announcements about found beacons
- **max_distance** - maximum distance in meters where the scanner will still send the data to a publisher, 0 means unlimited
- **whitelist** - array of iBeacon IDs as whitelist for updates that should be sent to the publisher, an empty list disables the whitelist
- **blacklist** - array of iBeacon IDs as blacklist for updates that should not be sent to the publisher, an empty list disables the blacklist
- **use_mac** - publish the Bluetooth MAC address instead of the UUID (for devices without a consistent UUID)
- **system_noise** - describes how noisy the system is and should be kept relatively low (used for the Kalman filter)
- **measurement_noise** - describes how noisy the measurements are (used for the Kalman filter)
- **major_mask** - filters out bits of the major id to make dynamic values with encoded information consistent for filtering (for more information see [#20](https://github.com/mKeRix/room-assistant/pull/20))
- **minor_mask** - filters out bits of the minor id to make dynamic values with encoded information consistent for filtering (for more information see [#20](https://github.com/mKeRix/room-assistant/pull/20))

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

#### Raspberry Pi GPIO
This a very generic component for grabbing data off the GPIO pins on the Raspberry Pi.
For example you could install a PIR motion sensor to augment the BLE presence tracking.

This component relies on a tool that you need to install with the following commands:

```
git clone -b fixpath https://github.com/rexington/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio
```

Please note that we are using a fork of the actual tool. Unfortunately the official repository has a severe bug that is not being fixed despite multiple issues and a pull request with the fix.
```json
{
  "gpio": {
    "enabled": true,
    "only_send_updates": false,
    "ports": [
      {
        "port": 7,
        "interval": 1000,
        "channel": "motion_sensor"
      }
    ],
    "qos": 1,
    "retain": true
  }
}
```

Options:
- **enabled** - enable or disable component
- **only_send_updates** - only post to the publisher if the value changed
- **ports** - an array of ports to be checked
  - **port** - the actual physical port number to be tracked ([reference](https://github.com/rakeshpai/pi-gpio#about-the-pin-configuration))
  - **interval** - the interval in which the port should be checked in milliseconds
  - **channel** - channel for value updates
- **qos** - quality of service level for the message (for MQTT)
- **retain** - whether the message should be retained or not (for MQTT)

#### Shell Commands ####
This component executes any given shell command regularly and reports the stdout output to your publisher.

```json
{
  "shell": {
      "enabled": true,
      "commands": [
        {
          "command": "/home/pi/airsensor/airsensor -o",
          "regexp": "(.*)",
          "float": false,
          "interval": 60000,
          "channel": "air_quality"
        }
      ],
      "qos": 0,
      "retain": false
    }
}
```

Options:
- **enabled** - enable or disable component
- **commands** - an array of commands to be executed
  - **command** - any bash command, make sure the user executing room-assistant has the needed permissions
  - **regexp** - regular expression string to tune your output, the first matched group will be used
  - **float** - whether to convert to the output to a float or not
  - **interval** - the interval in which the command should be executed in milliseconds
  - **channel** - channel for value updates
- **qos** - quality of service level for the message (for MQTT)
- **retain** - whether the message should be retained or not (for MQTT)

## Contributing ##
I started this project mainly to augment my own home automation with Raspberry Pi 3 beacons in each room.
This was my solution for being too lazy for turning on the lights and heating per room as I come and go.
If this is of any use to you - cool! If you want to add some code - even cooler! Just create a ticket or a pull request.
There currently are no specific criteria to meet as long as you follow the basic principles demonstrated in the existing components. And if you can: add unit tests too, even if my work on that has not gotten far yet.
