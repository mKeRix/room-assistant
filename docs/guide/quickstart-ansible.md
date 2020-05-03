# Ansible

This guide will show you how to manage multiple instances of room-assistant around your house easily. This is especially interesting as it allows you to define common configuration and update all instances at once. Additionally, it takes care of running all the installation steps for you.

## Requirements

- Recent version of [ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) (2.8+) installed on your computer/laptop

## Steps

1. Setup your Linux boards (e.g. Pi 3, 4 or Zero W) to the point where you can access them over the network with SSH. If you want a quick reference on how to do this for Raspberry devices you can take a look at the first section of their respective quickstart guides in the documentation.

2. Clone the repository containing the room-assistant playbook: `git clone https://github.com/mKeRix/ansible-playbooks.git`

3. Switch to the folder that you just cloned and run `ansible-galaxy install -r requirements.yml` to download the dependencies.

4. Create a file `hosts.yml` in the cloned folder. It should contain a list of network addresses for your devices under `all` (e.g. `bedroom.local` or `192.168.1.10`) and your room-assistant configuration. You can find a more detailed reference of the available options in the repository [README](https://github.com/mKeRix/ansible-playbooks#options) and the [Ansible documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html). Below is an example that configures a generic `room_assistant_global_config`, which is partially overridden for the `living-room.local` node.

   ```yaml
   all:
     hosts:
       'living-room.local':
         room_assistant_config: 
           global:
             integrations:
               - homeAssistant
               - bluetoothClassic
               - omronD6t
               - gpio
           gpio:
             binarySensors:
               - name: Motion Sensor
                 pin: 17
                 deviceClass: motion
       'bedroom.local':
     vars:
       room_assistant_global_config:
         global:
           integrations:
             - homeAssistant
             - bluetoothClassic
         homeAssistant:
           mqttUrl: mqtt://homeassistant.local:1883
           mqttOptions:
             username: room-assistant
             password: secretpass
         bluetoothClassic:
           addresses:
             - 'xx:xx:xx:xx:xx:xx'
   ```

5. Execute the playbook with `ansible-playbook -i hosts.yml -u pi room-assistant.yml` to install the required dependencies and room-assistant as a service on all of the hosts in your inventory file. Note that some tasks will take a while on the first run, for example the "Install room-assistant" step. Be patient and let it finish.

6. Congratulations, you have installed room-assistant across a cluster of devices and can manage it from a central point now! :tada: Whenever you want to update or change something you can simply edit your `hosts.yml` file as needed and re-run `ansible-playbook -i hosts.yml -u pi room-assistant.yml`.

