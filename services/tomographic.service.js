'use strict';

const KalmanService = require('../mixins/kalman.mixin');

module.exports = {
    name: 'tomographic',

    mixins: [KalmanService],

    metadata: {
        bluetooth: {
            requiresScanLE: true,
            requiresAdvertiseLE: true
        }
    },

    events: {
        'bluetooth.ble.scan.internalDiscovery'(peripheral) {
            const handle = peripheral.advertisement.localName;
            if (!this.rssiCache.has(handle)) {
                this.rssiCache.set(handle, []);
            }

            this.rssiCache.get(handle).push(peripheral.rssi);
        }
    },

    methods: {
        publishRssi() {
            for (const [handle, cachedRssis] of this.rssiCache.entries()) {
                if (cachedRssis.length > 0) {
                    const averageRssi = cachedRssis.reduce((a, b) => a + b) / cachedRssis.length;
                    const filteredRssi = this.smoothData(handle, averageRssi);

                    console.log({
                        name: handle,
                        rssi: filteredRssi
                    });
                }

                this.rssiCache.set(handle, []);
            }
        }
    },

    created() {
        this.rssiCache = new Map();
        setInterval(this.publishRssi, 500);
    }
};
