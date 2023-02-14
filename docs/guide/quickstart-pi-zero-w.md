# Raspberry Pi Zero W

This page will guide you through setting up a Pi Zero W to run room-assistant.

## Requirements

### Hardware

- Raspberry Pi Zero W + Power Supply
- Micro SD Card (ideally Application Class 1)
- SD Card reader

### Software

- [Raspberry Pi Imager](https://www.raspberrypi.org/software/)

## Installing Raspbian

1. Put your microSD card into your card reader.
2. Open the [Raspberry Pi Imager](https://www.raspberrypi.org/software/) and select the following options:
   1. OS -> Raspberry Pi OS (other) -> Raspberry Pi OS (Lite)
   2. SD Card -> the SD card you put into your card reader
   3. Open the advanced options (Windows: *Ctrl + Shift + X*, macOS: *Cmd + Shift + X*) and enable SSH. Optionally, you can configure WiFi credentials, the hostname to be something recognizable like `bedroom` and more in this same menu. Hit "Save" on the bottom after you're done.
3. Write the image to the card from the main menu. Wait for it to be finished before removing the card from the reader.
4. Insert the SD card into your Raspberry Pi Zero W, then connect the power supply. Wait a minute for it to boot and connect to your network.
5. Open a SSH shell to `<hostname>.local` (default: `raspberrypi.local`) with the user `pi` and the password you configured (default: `raspberry`). On Windows you can use [Putty](https://www.putty.org), with Linux and macOS you can just open the terminal and e.g. type `ssh pi@raspberrypi.local`. If the hostname is not found, use the IP of the Pi instead - it can be found in your router administration panel.

## Installing room-assistant

1. Now we install NodeJS by running

   ```bash
   wget -O - https://gist.githubusercontent.com/mKeRix/88b7b81e9bca044f74de1dc51696efb2/raw/799a20bca44cc61d8f8ae93878f2f28af8365a69/getNodeLTS.sh | bash
   ```

2. To make the commands we install with npm available the $PATH environment variable needs to be extended as well. Edit the file `~/.profile` (e.g. with `nano ~/.profile`) and add the `PATH="$PATH:/opt/nodejs/bin"` to the end of the file. Save, then run `source ~/.profile`.

3. We need to install some other dependencies as well, do so by running `sudo apt-get update && sudo apt-get install build-essential libavahi-compat-libdnssd-dev libsystemd-dev bluetooth libbluetooth-dev libudev-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`.

4. Now let's get install room-assistant! Run `sudo npm i --global --unsafe-perm room-assistant`. You will see messages like the one shown below during the installation process. Don't worry about them - they're not errors!

   ![compilation messages](./compilation-msgs.png)

5. *Optional:* If you want to run Bluetooth related integrations, you should also grant some additional permissions by executing the commands below.

   ```shell
   sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
   sudo setcap cap_net_raw+eip $(eval readlink -f `which hcitool`)
   sudo setcap cap_net_admin+eip $(eval readlink -f `which hciconfig`)
   ```

   

## Configuring room-assistant

1. Create a config folder for room-assistant with `mkdir -p ~/room-assistant/config`.

2. Create a new config file with `nano ~/room-assistant/config/local.yml` and put your room-assistant configuration in it. The example below configures the [Home Assistant Core](/integrations/home-assistant.md) and [Bluetooth Classic](/integrations/bluetooth-classic.md) integrations. If you want to use something else check out the [integrations](/integrations) section.

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
   Type=notify
   ExecStart=/opt/nodejs/bin/room-assistant
   WorkingDirectory=/home/<user>/room-assistant
   TimeoutStartSec=120
   TimeoutStopSec=30
   Restart=always
   RestartSec=10
   WatchdogSec=60
   User=<user>
   
   [Install]
   WantedBy=multi-user.target
   ```
   Note: The new Raspbian installer prompts you to name the user so the default users is no longer 'pi'. Replace <user> by whatever you used during the installation of Raspbian.

3. Enable and start your service by executing the commands below.

   ```shell
   sudo systemctl enable room-assistant.service
   sudo systemctl start room-assistant.service
   ```

4. Congratulations, you are done! :confetti_ball: You may check the status of the service at any time with `sudo systemctl status room-assistant`. room-assistant will now be started when the Pi Zero W boots.
