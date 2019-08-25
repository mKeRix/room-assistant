'use strict';

const _ = require('lodash');
const config = require('config');

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

    settings: {
        room: config.get('room'),
        thresholds: {}
    },

    events: {
        'bluetooth.ble.scan.internal-discovery'(peripheral) {
            const handle = peripheral.advertisement.localName;
            if (!this.rssiCache.has(handle)) {
                this.rssiCache.set(handle, []);
            }

            this.rssiCache.get(handle).push(peripheral.rssi);
        },

        'tomographic.connections.new-reading'(reading) {
            if (this.isCalibrating) {
                this.addCalibrationData(reading.target, reading.rssi);
            } else {
                const isTripped = this.isConnectionTripped(reading.target, reading.rssi);
                const state = this.stateMap.get(reading.target) || { tripped: null, count: 0 };

                if (state.tripped !== isTripped) {
                    state.count += 1;

                    if (state.count > 2) {
                        this.broker.broadcast('tomographic.connections.state-changed', {
                            from: `${this.broker.namespace}-${this.settings.room}`,
                            to: reading.target,
                            tripped: isTripped
                        });

                        state.tripped = isTripped;
                        state.count = 0;
                    }

                    this.stateMap.set(reading.target, state);
                }
            }
        },

        'tomographic.connections.state-changed'(payload) {
            console.log(payload);
        },

        'tomographic.calibration.start'() {
            this.logger.info('Starting calibration...');
            this.calibrationCache.clear();
            this.isCalibrating = true;
        },

        'tomographic.calibration.stop'() {
            this.calibrateZeroState();
            this.isCalibrating = false;
            this.calibrationCache.clear();
            this.logger.info('Calibration finished.');
        }
    },

    actions: {
        calibrate(ctx) {
            ctx.broker.broadcast('tomographic.calibration.start');
            setTimeout(() => {
                ctx.broker.broadcast('tomographic.calibration.stop');
            }, 60 * 1000);
        }
    },

    methods: {
        publishReadings() {
            for (const [handle, cachedRssis] of this.rssiCache.entries()) {
                if (cachedRssis.length > 0) {
                    const averageRssi = cachedRssis.reduce((a, b) => a + b) / cachedRssis.length;
                    const filteredRssi = this.smoothData(handle, averageRssi);

                    this.broker.broadcastLocal('tomographic.connections.new-reading', {
                        target: handle,
                        rssi: filteredRssi
                    });
                }

                this.rssiCache.set(handle, []);
            }
        },

        isConnectionTripped(target, rssi) {
            if (_.has(this.settings.thresholds, target)) {
                return rssi < this.settings.thresholds[target];
            } else {
                return false;
            }
        },

        addCalibrationData(target, rssi) {
            if (!this.calibrationCache.has(target)) {
                this.calibrationCache.set(target, []);
            }

            this.calibrationCache.get(target).push(rssi);
        },

        calibrateZeroState() {
            for (const [target, rssis] of this.calibrationCache.entries()) {
                if (rssis.length > 0) {
                    this.settings.thresholds[target] = Math.max(...rssis) * 1.1;
                }
            }
        }
    },

    created() {
        this.isCalibrating = false;
        this.calibrationCache = new Map();

        this.stateMap = new Map();
        this.rssiCache = new Map();
        setInterval(this.publishReadings, 500);
    }
};
