# Installation

::: tip

Also checkout the quickstart guides in the menu on the left! If you are planning on installing room-assistant on multiple hosts [Ansible](./quickstart-ansible.md) will automate the process for you.

:::

## Running with NodeJS

### Recommended for...

Dedicated or resource-limited computers, like Raspberry Pis.  Has least overhead but may conflict with other services, particularly those based on different versions of Node.js.

### Requirements

Please make sure you have either NodeJS 14.x or NodeJS 12.x installed. The version provided by Raspbian by default is outdated.
Installation guides for NodeJS can be found [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions). For Pi Zero devices you will need to use a [different installation process](./quickstart-pi-zero-w.md#installing-room-assistant).

room-assistant instances use some native dependencies for discovering each other in the local network using mDNS and providing health checks for systemd. You will require two additional system packages to get this working:

```shell script
sudo apt-get install libavahi-compat-libdnssd-dev libsystemd-dev
```

Note that some of the integrations may also require system packages to be installed, please look at the documentation of the integrations you want to use for this information.

### Installation

You can install room-assistant using npm with the following command:

```shell script
sudo npm i --global --unsafe-perm room-assistant
```

npm will link the binary for running the software, usually into `/usr/bin/room-assistant`.
If the directory is already in your `PATH` you can start it directly by typing `room-assistant`. Otherwise you can start it by typing the full path name of where it was installed.

::: tip

During installation you may see a lot of messages like the one in the image below scroll by. Don't worry - these are not errors! This is just the output of dependencies being compiled. As long as npm does not say that the installation ran into an error at the end you are good.

![compilation messages](./compilation-msgs.png)

:::

### Making it a service

To make sure room-assistant always runs on your machine you can create a system service for it. Create the file `/etc/systemd/system/room-assistant.service` similar to the following example:

```
[Unit]
Description=room-assistant service

[Service]
Type=notify
ExecStart=/usr/local/bin/room-assistant
WorkingDirectory=/home/pi/room-assistant
TimeoutStartSec=120
TimeoutStopSec=30
Restart=always
RestartSec=10
WatchdogSec=60
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

### Recommended for...

Computers being used as general servers.  Slightly more overhead but avoids possible conflicts with other services.

### Installation

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

## Running with Home Assistant OS

You can install room-assistant as Home Assistant OS add-on by [adding the following URL as repository](https://www.home-assistant.io/hassio/installing_third_party_addons/):

`https://github.com/mKeRix/hassio-repo`
