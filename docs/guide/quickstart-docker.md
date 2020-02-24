# Docker

This page will guide you through setting up room-assistant with Docker and docker-compose.

1. Create a new folder to store your room-assistant files in with `mkdir -p ~/room-assistant/config`.

2. Create the file `~/room-assistant/config/local.yml` and put your configuration into it. The example below configures the [Home Assistant](/integrations/home-assistant) and [Bluetooth Classic](/integrations/bluetooth-classic) integrations, but there are many others to choose from. For all options take a look at the [integrations](/integrations) section.

   ```yaml
   global:
     instanceName: bedroom
     integrations:
       - homeAssistant
       - bluetoothClassic
   homeAssistant:
     mqttUrl: 'mqtt://<mqtt-ip>:1883'
     mqttOptions:
       username: youruser
       password: yourpass
   bluetoothClassic:
     addresses:
       - <bluetooth-mac-of-device-to-track>
   ```

3. Create the file `~/room-assistant/docker-compose.yml` with the content below. Note that the `/var/run/dbus` volume only needs to be mounted on Linux systems. Other systems do not have auto discovery capabilities in Docker.

   ```yaml
   version: '3'
   services:
     room-assistant:
       image: mkerix/room-assistant
       restart: unless-stopped
       network_mode: host
       volumes:
         - /var/run/dbus:/var/run/dbus
         - <host-path-to>/room-assistant/config:/room-assistant/config
   ```

4. From the `~/room-assistant` directory run `docker-compose up`. You should see all configured integrations load and the MQTT connection being established in the logs. New entities should now be appearing under the MQTT integration in Home Assistant, which can be viewed in Settings > Integrations. Congratulations, you are done! :confetti_ball:

