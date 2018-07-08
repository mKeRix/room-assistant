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
        useAddress : false,
        processIBeacon: true,
        onlyIBeacon: false,
        majorMask: 0xFFFF,
        minorMask: 0xFFFF
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
            if (this.settings.processIBeacon && this.isIBeacon(peripheral)) {
                peripheral = this.extractIBeacon(peripheral);
            } else if (this.settings.onlyIBeacon) {
                return;
            }

            const handle = this.settings.useAddress ? peripheral.address : peripheral.id;

            if (this.isOnWhitelist(handle) && !this.isThrottled(handle)) {
                const power = peripheral.measuredPower || peripheral.advertisement.txPower;
                const distance = this.calculateDistance(peripheral.rssi, power);
                const filteredDistance = this.smoothData(handle, distance);

                const payload = {
                    channel: this.settings.channel,
                    data: {
                        id: handle,
                        name: peripheral.advertisement.localName,
                        rssi: peripheral.rssi,
                        uuid: peripheral.uuid,
                        major: peripheral.major,
                        minor: peripheral.minor,
                        distance: filteredDistance
                    },
                    options: {}
                };

                this.broker.emit('data.found', payload);
            }
        },

        isIBeacon(peripheral) {
            const manufacturerData = peripheral.advertisement.manufacturerData;

            return manufacturerData
                && 25 <= manufacturerData.length // expected data length
                && 0x004c === manufacturerData.readUInt16LE(0) // apple company identifier
                && 0x02 === manufacturerData.readUInt8(2) // ibeacon type
                && 0x15 === manufacturerData.readUInt8(3); // expected ibeacon data length
        },

        extractIBeacon(peripheral) {
            const manufacturerData = peripheral.advertisement.manufacturerData;

            peripheral.uuid = manufacturerData.slice(4, 20).toString('hex');
            peripheral.major = manufacturerData.readUInt16BE(20);
            peripheral.minor = manufacturerData.readUInt16BE(22);
            peripheral.measuredPower = manufacturerData.readInt8(24);
            peripheral.id = `${peripheral.uuid}-${peripheral.major & this.settings.majorMask}-${peripheral.minor & this.settings.minorMask}`;

            return peripheral;
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
