'use strict';

const noble = require('noble');

const KalmanService = require('../mixins/kalman.mixin');
const ThrottledService = require('../mixins/throttled.mixin');
const WhitelistService = require('../mixins/whitelist.mixin');

module.exports = {
    name: 'ble',

    mixins: [KalmanService, ThrottledService, WhitelistService],

    settings: {
        channel: 'room_presence',
        useAddress : false
    },

    methods: {
        handleStateChange(state) {
            if (state === 'poweredOn') {
                noble.startScanning([], true);
            } else {
                noble.stopScanning();
            }
        },

        handleDiscovery(peripheral) {
            const handle = this.settings.useAddress ? peripheral.address : peripheral.id;

            if (this.isOnWhitelist(handle) && !this.isThrottled(handle)) {
                const distance = this.calculateDistance(peripheral.rssi, peripheral.advertisement.txPower);
                const filteredDistance = this.smoothData(handle, distance);

                const payload = {
                    channel: this.settings.channel,
                    data: {
                        id: handle,
                        name: peripheral.advertisement.localName,
                        rssi: peripheral.rssi,
                        distance: filteredDistance
                    },
                    options: {}
                };

                this.broker.emit('data.found', payload);
            }
        },

        calculateDistance(rssi, txPower) {
            if (rssi === 0) {
                return -1.0;
            }
            if (!txPower) {
                // somewhat reasonable default value
                txPower = -59;
            }

            const ratio = rssi * 1.0 / txPower;
            if (ratio < 1.0) {
                return Math.pow(ratio, 10);
            } else {
                return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
            }
        }
    },

    created() {
        noble.on('stateChange', this.handleStateChange);
        noble.on('discover', this.handleDiscovery);
    }
};
