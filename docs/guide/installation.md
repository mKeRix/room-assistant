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

## Running with Hass.io

You can install room-assistant as Hass.io add-on by [adding the following URL as repository](https://www.home-assistant.io/hassio/installing_third_party_addons/):

`https://github.com/mKeRix/hassio-repo`

The software can be configured using the same options as for other platforms, but in JSON format.
