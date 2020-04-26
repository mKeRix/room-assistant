# Troubleshooting

## Post-install

### Slow/unresponsive device over SSH

On some Single Board computers, such as the Raspberry Pis with integrated Wifi/BT, Bluetooth and WiFi are on a shared chip and antenna. If Bluetooth communication is happening the chip will temporarily shutdown WiFi packets until it is done, then switch back. Only one protocol is active at the same time, which can lead to request timeouts and delays in packets: if the the device is pinged at the wrong time, it won't accept a connection, and thus will time out. It will also lead to sluggish SSH sessions occasionally.

Why? The command used for polling takes about 5.5s overall, most of which are Bluetooth communication. If all whitelisted devices are away the SBC essentially only has about 1s of the 6s interval available for WiFi communication. If devices are near the effects are much less noticeable, as the polling finishes quickly and unlocks the chip for WiFi communication.

If you don't have anything else running on the Pis this shouldn't be much of an issue - room-assistant can handle the harsh network conditions. If you want the Pis to be more responsive and/or run other applications on them, currently there is only one solution that will do the trick: increase the interval. Keep in mind this also slows down the detection a bit.

[See here for the original issue context where this was discussed](https://github.com/mKeRix/room-assistant/issues/178)