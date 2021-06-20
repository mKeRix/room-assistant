# Upgrading

room-assistant uses [semantic versioning](https://semver.org/). Minor version upgrades should require no additional steps, major upgrades may require you do [some additional steps](#major-upgrades).

## Upgrade Process

### NodeJS

Stop room-assistant on the machine, then run `sudo npm i --global --unsafe-perm room-assistant` to download and install the latest version.

### Docker

If you're using images with specific version tags you can just exchange the tag with the new version. For `latest` or `beta` you need to pull the image again to retrieve the latest version. Then just recreate your container with the latest image version - e.g. with docker-compose `docker-compose stop && docker-compose up`.

### Home Assistant OS

Upgrade the room-assistant add-on from the Supervisor Add-on Store panel. Note that the Home Assistant OS release is slightly delayed to the other releases and may not immediately be visible.

## Major Upgrades

### 0.x or 1.x to 2.x

room-assistant 2.0 is another rewrite of the software to bring it up-to-par with current standards and keep it maintainable. Due to this, many things have changed although all core functionality has been kept. A fresh installation of room-assistant is recommended.

#### Installation process

The installation process has changed and is not git-based anymore when running room-assistant directly with NodeJS. Instead, you now need to install the room-assistant binary directly with npm. See the [installation guide](./installation.md#running-with-nodejs) for detailed information. You can delete the old cloned folder - but keep a copy of your old config for reference.

For Docker-based installations note that on Linux systems you should also mount the `/var/run/dbus` folder into the container now to make use of the auto-discovery features.

The Home Assistant OS addon has changed its ID from `room-assistant` to `room_assistant` to comply with the standard and therefore needs to be reinstalled as a different add-on.

#### Dependencies

Instead of installing dependencies when starting, room-assistant now just tries to install everything right away. This makes the start much quicker and less confusing. Integration-specific dependencies are marked as optional - they may fail to install initially. Make sure you fulfill the documented requirements and then run the installation command once more to get missing dependencies.

#### Config format

You can still use JSON as your config format like you did before, however YAML is now also accepted and the preferred method. The config is loaded from `<working-dir>/config`. For Docker you can either choose to mount config files into `/room-assistant/config` or fill the `NODE_CONFIG` environment variable with your config in JSON format. Individual environment variables for the options have been removed.

Note that the layout of the config has changed, even if the naming is similar. It is recommended that you just start a fresh configuration file and copy the previous values over while consulting the [configuration](./configuration.md) and [integration](/integrations) documentation.

### 1.0.x to 1.1.x

Run `npm install` to get the latest versions of the dependencies.

**If you used the gpio or shell service:**

In room-assistant 1.1.x we integrated the MQTT auto discovery feature. If you do not want to use this you do not need to change anything.

If you do, please restructure the configuration of your room-assistant AND Home Assistant Core instances to support this feature.

**If you used the prometheus service:**

The api service is not needed anymore and was removed. You should remove it from your configured list of services as well. Furthermore you need to rename the `api` setting in JSON to `prometheus`. If you use Docker you need to rename the `API_PORT` environment variable to `PROMETHEUS_PORT`. Note that the default port changed to `3030`, as documented [here](https://github.com/mKeRix/room-assistant/wiki/Configuration#prometheus).

### 0.x.x to 1.0.x

Version 1.0 of room-assistant was rewritten from scratch to achieve a cleaner and more stable codebase. This means that there are a few breaking changes you should take care of when upgrading. Please work through the sections applicable to your setup.

#### General

After downloading the newest codebase with `git pull` remove the `node_modules` directory completely to get a clean start. Also make sure that your current setup is ideally NodeJS 8 or higher and npm 5.7.1 or higher and run upgrades for those if needed. Then you can run `npm install --production` to get the new base dependencies. The service specific components will be installed on startup now.

You will have to redo your [configuration](https://github.com/mKeRix/room-assistant/wiki/Configuration) as the schema changed slightly. For Docker installations you may also use the new options for configuring via environment variables now.

Start by backing up your current configuration and making a copy of `config/default.json` as your new `config/local.json` (or use the environment variable syntax). You will need to change two main variables:

- `services` should be an array of service IDs that had `enabled: true` in your previous configuration
- `room` is equivalent to the old `mqtt.topic`

Support for the `unsafe` mode and `logging` to the filesystem has been removed.

#### MQTT

The MQTT component remains unchanged, except for the removal of `topic` in favor of the above described setting `room`.

#### Console

Console output does not have its own configuration settings anymore and just needs to be enabled in `services`.

#### Bluetooth Low Energy and iBeacons

The BLE and iBeacon components have been merged into one. The configuration options have been changed accordingly:

- `use_mac` is now called `useAddress`
- `max_distance` is now called `maxDistance`
- `update_frequency` is now called `updateFrequency` and measured in seconds instead of milliseconds
- `blacklist` has been removed in favor of just a `whitelist`
- `processIBeacon` now determines whether iBeacon advertisement data should be processed or ignored, set to `false` if previously only using the BLE component
- `onlyIBeacon` now determines whether only iBeacons should be published, set to `true` if previously only using the iBeacon component
- `system_noise` has been removed
- `measurement_noise` has been removed

#### Temper USB Sensors

Support for Temper sensors has been removed. If this is an issue for you, please open a new issue on Github.

#### GPIO

The GPIO component has been changed to watch for changes instead of polling for them. The options are also now provided in array form and can all be changed for each device. What you previously had configured under `gpio.ports` should now be the content for `gpio` directly. Specifically this means:

- `port` is now called `pin` and references to the [BCM number](https://pinout.xyz) instead
- `retain` can now be set for each pin
- `interval` has been removed, as the component now watches for changes instead of polling
- `only_send_updates` has been removed and is now default behavior
- `qos` has been removed

#### Shell

The shell component is largely the same, but has also been adapted to make all options available per command. You should move the contents of `shell.commands` directly to `shell`. More specifically the options were changed as follows:

- `interval` has been removed in favor of `cron`, a [cron pattern](https://crontab.guru) with accuracy up to seconds determining the execution pattern - if your `interval` was previously `60000` your cron setting should now be `0 * * * * *`
- `float` is now called `number`
- `retain` can now be set for each command separately
- `qos` has been removed
