# Installation

## Running with NodeJS

### Requirements

Please make sure you have either NodeJS 10.x or NodeJS 12.x installed. The version provided by Raspbian by default is outdated.
Installation guides for NodeJS can be found [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions). For Pi Zero devices you will need to use a [different installation process](https://github.com/sdesalas/node-pi-zero#vlts).

room-assistant instances discover each other in the local network using mDNS. You will require two additional system packages to get this working:

```shell script
sudo apt-get install libavahi-compat-libdnssd-dev
```

Note that some of the integrations may also require system packages to be installed, please look at the documentation of the integrations you want to use for this information.

### Installation

You can install room-assistant using npm with the following command:

```shell script
sudo npm i --global --unsafe-perm room-assistant
```

npm will link the binary for running the software, usually into `/usr/bin/room-assistant`.
If the directory is already in your `PATH` you can start it directly by typing `room-assistant`. Otherwise you can start it by typing the full path name of where it was installed.

### Making it a service

To make sure room-assistant always runs on your machine you can create a system service for it. Create the file `/etc/systemd/system/room-assistant.service` similar to the following example:

```
[Unit]
Description=room-assistant service

[Service]
ExecStart=/usr/local/bin/room-assistant
WorkingDirectory=/home/pi/room-assistant
Restart=always
RestartSec=10
User=pi

[Install]
WantedBy=multi-user.target
```

After you have your config ready - in the above example it should be located in `/home/pi/room-assistant/config/` - you can start and enable the service with:

```shell
sudo systemctl enable room-assistant.service
sudo systemctl start room-assistant.service
```

## Running with Docker

This project provides official Docker images on [Docker Hub](https://hub.docker.com/r/mkerix/room-assistant/). You can either use the latest or a specific version by using the correct tag. It is strongly recommended to run this image with the `host` network, otherwise you may run into problems with many parts of the software. For auto-discovery functionality on Linux you will need to map the `/var/run/dbus` volume.

::: details Example docker-compose.yml

```yaml
version: '3'
services:
  room-assistant:
    image: mkerix/room-assistant
    network_mode: host
    volumes:
      - /var/run/dbus:/var/run/dbus
```

:::

## Running with Home Assistant

You can install room-assistant as a Home Assistant add-on by [adding the following URL as repository](https://www.home-assistant.io/hassio/installing_third_party_addons/):

`https://github.com/mKeRix/hassio-repo`
