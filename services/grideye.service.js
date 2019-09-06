'use strict';

const _ = require('lodash');
const config = require('config');
const i2c = require('i2c-bus');
const math = require('mathjs');

const filters = require('../utils/filters');

const GRIDEYE_ADDRESS = 0x69;
const TEMPERATURE_REGISTER_START = 0x80;

module.exports = {
    name: 'grideye',

    settings: {
        i2cDevice: config.get('grideye.i2cDevice'),
        edgeThreshold: config.get('grideye.edgeThreshold'),
        retain: config.get('grideye.retain')
    },

    methods: {
        updateState() {
            const newState = this.isPresent();

            if (newState !== this.state) {
                this.state = newState;
                this.broker.emit('data.found', {
                    channel: 'grideye',
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
            if (this.measurementsCache.length < 2) {
                return false;
            }

            const temperatures = math.round(math.divide(math.add(...this.measurementsCache), this.measurementsCache.length), 1);
            const temperatureMedian = math.median(temperatures);
            const temperatureDeviations = math.subtract(temperatures, temperatureMedian);
            const temperatureEdges = filters.applySobel(temperatureDeviations);

            let isPresent = false;
            const edgesSize = math.size(temperatureEdges);
            math.forEach(temperatureEdges, (edge, index) => {
                if (edge >= this.settings.edgeThreshold) {
                    const neighbors = math.subset(temperatures, math.index([
                        _.clamp(index[0] - 1, 0, edgesSize[0] - 1),
                        _.clamp(index[0] + 1, 0, edgesSize[0] - 1),
                    ], [
                        _.clamp(index[1] - 1, 0, edgesSize[1] - 1),
                        _.clamp(index[1] + 1, 0, edgesSize[1] - 1),
                    ]));

                    const presenceHits = _.filter(math.flatten(neighbors), t => t > temperatureMedian);
                    if (presenceHits.length > 1) {
                        isPresent = true;
                    }
                }
            });

            this.logger.debug(`Evaluating presence as ${isPresent}. Maximum edge was ${math.max(temperatureEdges)}. Got temperatures:\n${temperatures}`);

            return isPresent;
        },

        updateMeasurementsCache() {
            if (this.measurementsCache.length >= 5) {
                this.measurementsCache.shift();
            }

            let temperatures;
            try {
                temperatures = this.getPixelTemperatures();
            } catch (e) {
                this.logger.error(e);
                return;
            }

            this.measurementsCache.push(temperatures);
        },

        getPixelTemperatures() {
            const temperatures = [];
            for (let i = 0; i < 64; i++) {
                temperatures.push(this.getPixelTemperature(i));
            }

            return math.reshape(temperatures, [8, 8]);
        },

        getPixelTemperature(pixelAddr) {
            const pixelLowRegister = TEMPERATURE_REGISTER_START + (2 * pixelAddr);
            let temperature = this.getRegister(pixelLowRegister, 2);

            if (temperature & (1 << 11)) {
                temperature &= ~(1 << 11);
                temperature = temperature * -1;
            }

            return temperature * 0.25;
        },

        getRegister(register, length) {
            const commandBuffer = Buffer.alloc(1);
            commandBuffer.writeUInt8(register, 0);
            const resultBuffer = Buffer.alloc(length);

            this.i2cBus.i2cWriteSync(GRIDEYE_ADDRESS, commandBuffer.length, commandBuffer);
            this.i2cBus.i2cReadSync(GRIDEYE_ADDRESS, length, resultBuffer);

            const lsb = resultBuffer.readUInt8();
            const msb = resultBuffer.readUInt8(1);

            return msb << 8 | lsb;
        },

        setRegister(register, value) {
            const commandBuffer = Buffer.alloc(2);
            commandBuffer.writeUInt8(register, 0);
            commandBuffer.writeUInt8(value, 1);

            this.i2cBus.i2cWriteSync(GRIDEYE_ADDRESS, commandBuffer.length, commandBuffer);
        }
    },

    created() {
        this.measurementsCache = [];
    },

    async started() {
        this.i2cBus = i2c.openSync(this.settings.i2cDevice);
        this.measurementInterval = setInterval(this.updateMeasurementsCache, 100);
        this.updateInterval = setInterval(this.updateState, 500);
    },

    async stopped() {
        clearInterval(this.measurementInterval);
        clearInterval(this.updateInterval);
        this.i2cBus.closeSync();
    }
};
