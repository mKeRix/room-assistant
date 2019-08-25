'use strict';

const _ = require('lodash');
const config = require('config');
const noble = require('@abandonware/noble');
const bleno = require('@abandonware/bleno');

module.exports = {
    name: 'bluetooth',

    settings: {
        room: config.get('room')
    },

    dependencies: [
        '$node'
    ],

    events: {
        '$services.changed'(payload) {
            if (payload.localService) {
                this.updateRequiredModes();
            }
        }
    },

    methods: {
        updateRequiredModes() {
            this.broker.call('$node.services', { onlyLocal: true, onlyAvailable: true })
                .then(services => {
                    this.shouldScanLE = _.some(services, 'metadata.bluetooth.requiresScanLE');
                    this.shouldAdvertiseLE = _.some(services, 'metadata.bluetooth.requiresAdvertiseLE');
                })
                .then(() => {
                    this.handleScanStateChange(noble.state);
                    this.handleAdvertiseStateChange(bleno.state);
                });
        },

        handleScanStateChange(state) {
            if (this.shouldScanLE && state === 'poweredOn') {
                if (!this.isScanning) {
                    noble.startScanning([], true);
                    this.isScanning = true;
                }
            } else {
                if (this.isScanning) {
                    noble.stopScanning();
                    this.isScanning = false;
                }
            }
        },

        handleAdvertiseStateChange(state) {
            if (this.shouldAdvertiseLE && state === 'poweredOn') {
                if (!this.isAdvertising) {
                    bleno.startAdvertising(`${this.broker.namespace}-${this.settings.room}`, []);
                    this.isAdvertising = true;
                }
            } else {
                if (this.isAdvertising) {
                    bleno.stopAdvertising();
                    this.isAdvertising = false;
                }
            }
        },

        handleDiscovery(peripheral) {
            const type = peripheral.advertisement.localName != null
                && peripheral.advertisement.localName.startsWith(this.broker.namespace) ? 'internal' : 'external';

            this.broker.broadcastLocal(`bluetooth.ble.scan.${type}Discovery`, peripheral);
        }
    },

    created() {
        this.isScanning = false;
        this.isScanning = false;
        this.shouldScanLE = false;
        this.shouldAdvertiseLE = false;
    },

    async started() {
        this.updateRequiredModes();

        noble.on('stateChange', this.handleScanStateChange);
        bleno.on('stateChange', this.handleAdvertiseStateChange);
        noble.on('discover', this.handleDiscovery);
    }
};
