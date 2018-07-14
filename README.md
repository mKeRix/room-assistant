# room-assistant

[![Build Status](https://travis-ci.org/mKeRix/room-assistant.svg?branch=master)](https://travis-ci.org/mKeRix/room-assistant)
[![Moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](https://moleculer.services)

room-assistant is a simple Node.js server for tracking presence and other things on a per-room basis.
It pairs well with the [mqtt_room](https://home-assistant.io/components/sensor.mqtt_room/) component of [Home Assistant](https://home-assistant.io/).

**Upgrading from room-assistant 0.x?** Please review the [upgrade guide](https://github.com/mKeRix/room-assistant/wiki/Upgrade-Guide).

## Installation

### Running with NodeJS

#### Requirements

Please make sure you have [a recent version of NodeJS installed](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions), as the one provided by Raspbian is outdated. 
For room-assistant we recommend using:

- NodeJS 8.0 or higher
- npm 5.7.1 or higher

If you want to run any Bluetooth related components you will also need some additional packages:

```bash
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev libusb-1.0-0-dev
```

#### Setting up

You can install room-assistant into a directory of your choice by cloning the git repository and installing the main dependencies:

```bash
git clone https://github.com/mKeRix/room-assistant.git
cd room-assistant
npm install --production
```

Once you have your [configuration](https://github.com/mKeRix/room-assistant/wiki/Configuration) in place you can start the service manually:

```bash
npm start
```

Any additional dependencies of the services you selected will be downloaded before the software starts.

#### Making it a service

To make sure your room-assistant is always running you should setup a service for it. On newer systems this can be done easily using systemd.
Create the file `/etc/systemd/system/room-assistant.service` with your favorite editor and fill it with the following data:

```
[Unit]
Description=Room Assistant service

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/pi/room-assistant
Restart=always
RestartSec=10
User=pi

[Install]
WantedBy=multi-user.target
```

Save the file, then enable and start the service using the following commands:

```bash
sudo systemctl enable room-assistant.service
sudo systemctl start room-assistant.service
```

You can now check the service status by running:

```bash
systemctl status room-assistant.service
```

#### Updating

To update room-assistant you simply need to pull the new version from GitHub and update the dependencies:

```bash
git pull
npm install --production
```

### Running with Docker

Currently two images are provided, a regular amd64 one and an arm32 based version. If you are running a Linux board like the Raspberry Pi you will most likely need the arm32 version. Find the available version tags on [Docker Hub](https://hub.docker.com/r/mkerix/room-assistant/).

Configuration can be done by providing your container with the needed environment variables as described in the [wiki examples](https://github.com/mKeRix/room-assistant/wiki/Configuration).

**Example amd64**

```
docker run --network=host --restart=unless-stopped -d --name room-assistant -e SERVICES=ble,console mkerix/room-assistant
``` 

**Example arm32, e.g. Raspberry Pi**

```
docker run --network=host --restart=unless-stopped -d --name room-assistant -e SERVICES=ble,console mkerix/room-assistant:latest-arm32
```

**Example docker-compose.yml**

```yaml
version: '2'
services:
  room-assistant:
    image: mkerix/room-assistant
    restart: always
    network_mode: host
    environment:
      SERVICES: 'ble,console'
      ROOM: 'docker-room'
```

### Running with Hass.io

To run on Hass.io please add [my addon repository](https://github.com/mKeRix/hassio-repo) to your installation as described.
You should then be able to select room-assistant from the add-on store and [configure it with the normal JSON based syntax](https://github.com/mKeRix/room-assistant/wiki/Configuration).

## Configuration

You can find detailed information about all available services and options in the [wiki](https://github.com/mKeRix/room-assistant/wiki/Configuration).

## Troubleshooting

If you are running into issues, please consult the [FAQ section](https://github.com/mKeRix/room-assistant/wiki/FAQ) and search through the [issues](https://github.com/mKeRix/room-assistant/issues) before creating a new one.
