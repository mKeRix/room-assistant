# Raspberry Pi Zero W

This page will guide you through setting up a Pi Zero W to run room-assistant.

## Requirements

### Hardware

- Raspberry Pi Zero W + Power Supply
- Micro SD Card (ideally Application Class 1)
- SD Card reader

### Software

- [balenaEtcher](https://www.balena.io/etcher/)
- Download of the latest [Raspbian Buster Lite image](https://www.raspberrypi.org/downloads/raspbian/)

## Installing Raspbian

1. Put your microSD card into your card reader.

2. Open balenaEtcher, select the Raspbian image you downloaded and flash it to the SD card.

3. After that is done, create an empty file called `ssh` on the `boot` partition of the SD card that you should now see in your file explorer. You may have to eject your SD card and put it back again before it becomes visible.

4. *Optional:* If you want to use the Pi Zero W with WiFi, you also need to configure the credentials. Create a file called `wpa_supplicant.conf` on the `boot` partition and fill it as shown below, with the marked variables replaced. A list of country codes is available on [Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1).

   ```
   ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
   update_config=1
   country=<Insert country code here>
   
   network={
    ssid="<Name of your WiFi>"
    psk="<Password for your WiFi>"
   }
   ```

5. Unmount the SD card and remove it from your card reader.

6. Insert the SD card into your Raspberry Pi Zero W, then connect the power supply. Wait a minute for it to boot and connect to your network.

7. Open a SSH shell to `raspberrypi.local` with the default user `pi` and password `raspberry`. On Windows you can use [Putty](https://www.putty.org), with Linux and macOS you can just open the terminal and type `ssh pi@raspberrypi.local`. If the hostname is not found, use the IP of the Pi instead - it can be found in your router administration panel.

8. Type `passwd` to change your password to something more secure.

9. Type `sudo raspi-config`, use the arrow keys to go to `Network Settings` and hit Enter, then select `Hostname`. Set the hostname to something recognizable, like `bedroom`. After that select `Finish` and let the Pi reboot.

## Installing room-assistant

1. Open a new SSH session, this time using the hostname (e.g. `bedroom.local`) and password you set above.

2. Now we install NodeJS by running `wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v.lts.sh | bash`.

3. To make the commands we install with npm available the $PATH environment variable needs to be extended as well. Edit the file `~/.profile` (e.g. with `nano ~/.profile`) and add the `PATH="$PATH:/opt/nodejs/bin"` to the end of the file. Save, then run `source ~/.profile`.

4. We need to install some other dependencies as well, do so by running `sudo apt-get update && sudo apt-get install build-essential libavahi-compat-libdnssd-dev bluetooth libbluetooth-dev libudev-dev`.

5. Now let's get install room-assistant! Run `sudo npm i --global --unsafe-perm room-assistant`. You will see messages like the one shown below during the installation process. Don't worry about them - they're not errors!

   ![compilation messages](./compilation-msgs.png)

6. *Optional:* If you want to run Bluetooth related integrations, you should also grant some additional permissions by executing the commands below.

   ```shell
   sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
   sudo setcap cap_net_raw+eip $(eval readlink -f `which hcitool`)
   sudo setcap cap_net_admin+eip $(eval readlink -f `which hciconfig`)
   ```

   

## Configuring room-assistant

1. Create a config folder for room-assistant with `mkdir -p ~/room-assistant/config`.

2. Create a new config file with `nano ~/room-assistant/config/local.yml` and put your room-assistant configuration in it. The example below configures the [Home Assistant Core](/integrations/home-assistant) and [Bluetooth Classic](/integrations/bluetooth-classic) integrations. If you want to use something else check out the [integrations](/integrations) section.

   ```yaml
   global:
     integrations:
       - homeAssistant
       - bluetoothClassic
   homeAssistant:
     mqttUrl: 'mqtt://homeassistant.local:1883'
     mqttOptions:
       username: youruser
       password: yourpass
   bluetoothClassic:
     addresses:
       - <bluetooth-mac-of-device-to-track>
   ```

3. Go to your room-assistant directory by executing `cd ~/room-assistant`.

4. Run room-assistant by executing `room-assistant`. Watch the logs - are all integrations are loaded correctly and is the MQTT connection succesful? Then congratulations, you configured room-assistant correctly! :tada: New entities should now be appearing under the MQTT integration in Home Assistant Core, which can be viewed in Settings > Integrations.

::: tip

When starting room-assistant you will see warnings about the Apple Bonjour compatibility layer of Avahi. These won't impact the functionality at all and can just be ignored.

:::

## Making sure it always runs

1. If room-assistant is still running from the previous step, stop it by hitting Ctrl + C on your keyboard.

2. Create a file using `sudo nano /etc/systemd/system/room-assistant.service` with the following contents:

   ```
   [Unit]
   Description=room-assistant service
   
   [Service]
   ExecStart=/opt/nodejs/bin/room-assistant
   WorkingDirectory=/home/pi/room-assistant
   Restart=always
   RestartSec=10
   User=pi
   
   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start your service by executing the commands below.

   ```shell
   sudo systemctl enable room-assistant.service
   sudo systemctl start room-assistant.service
   ```

4. Congratulations, you are done! :confetti_ball: You may check the status of the service at any time with `sudo systemctl status room-assistant`. room-assistant will now be started when the Pi Zero W boots.
