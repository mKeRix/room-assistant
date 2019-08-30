'use strict';

const config = require('config');
const i2c = require('i2c-bus');
const math = require('mathjs');

const filters = require('../utils/filters');
const DiscoveryService = require('../mixins/discovery.mixin');

const D6T_ADDRESS = 0x0a;
const TEMPERATURE_COMMAND = 0x4c;

module.exports = {
    name: 'd6t',

    mixins: [DiscoveryService],

    settings: {
        edgeThreshold: config.get('d6t.edgeThreshold'),
        retain: config.get('d6t.retain'),
        discoveryType: config.get('d6t.discoveryType'),
        discoveryConfig: config.get('d6t.discoveryConfig')
    },

    methods: {
        updateState() {
            const newState = this.isPresent();

            if (newState !== this.state) {
                this.state = newState;
                this.broker.emit('data.found', {
                    channel: 'd6t',
                    data: {
                        value: newState
                    },
                    options: {
                        retain: this.settings.retain
                    }
                });
            }
        },

        isPresent() {
            if (this.measurementsCache.length === 0) {
                return false;
            }

            const temperatures = math.round(math.divide(math.add(...this.measurementsCache), this.measurementsCache.length), 1);
            const temperatureEdges = filters.applySobel(temperatures);
            const maxEdge = math.max(temperatureEdges);
            const isPresent = maxEdge >= this.settings.edgeThreshold;

            this.logger.debug(`Evaluating presence as ${isPresent} with a maximum edge of ${maxEdge}. Got temperatures:\n${temperatures}`);

            return isPresent;
        },

        updateMeasurementsCache() {
            if (this.measurementsCache.length >= 10) {
                this.measurementsCache.shift();
            }

            const temperatures = this.getPixelTemperatures();
            // occasionally the data is invalid - then we can just discard it
            // TODO: use the PEC check instead
            if (math.max(temperatures) <= 50) {
                this.measurementsCache.push(temperatures);
            }
        },

        getPixelTemperatures() {
            // TODO: support D6T-8L-09
            const commandBuffer = Buffer.alloc(1);
            commandBuffer.writeUInt8(TEMPERATURE_COMMAND, 0);
            const resultBuffer = Buffer.alloc(35);

            this.i2cBus.i2cWriteSync(D6T_ADDRESS, commandBuffer.length, commandBuffer);
            this.i2cBus.i2cReadSync(D6T_ADDRESS, resultBuffer.length, resultBuffer);

            const pixelTemperatures = [];
            for (let i = 2; i < resultBuffer.length - 1; i += 2) {
                const temperature = (256 * resultBuffer.readUInt8(i + 1) + resultBuffer.readUInt8(i)) / 10;
                pixelTemperatures.push(temperature);
            }

            return math.reshape(pixelTemperatures, [4, 4]);
        }
    },

    created() {
        this.measurementsCache = [];
    },

    async started() {
        this.registerSensor(this.settings.channel, this.settings.discoveryType, this.settings.discoveryConfig);
        this.i2cBus = i2c.openSync(1);
        this.measurementInterval = setInterval(this.updateMeasurementsCache, 100);
        // TODO: try out different intervals
        this.updateInterval = setInterval(this.updateState, 1000);
    },

    async stopped() {
        clearInterval(this.updateInterval);
        clearInterval(this.measurementInterval);
        this.i2cBus.closeSync();
        this.unregisterSensor(this.settings.channel, this.settings.discoveryType);
    }
};
