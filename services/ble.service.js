'use strict';

const noble = require('noble');

module.exports = {
    name: 'ble',

    settings: {
        channel: 'room_presence'
    },

    methods: {
        handleStateChange(state) {
            if (state === 'poweredOn') {
                noble.startScanning();
            } else {
                noble.stopScanning();
            }
        },

        handleDiscovery(peripheral) {
            const payload = {
                channel: this.settings.channel,
                data: peripheral,
                options: {}
            };

            this.broker.emit('data.found', payload);
        }
    },

    created() {
        noble.on('stateChange', this.handleStateChange);
        noble.on('discover', this.handleDiscovery);
    }
};
