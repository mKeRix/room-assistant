'use strict';

const config = require('config');
const i2c = require('i2c-bus');
const math = require('mathjs');

const filters = require('../utils/filters');

const GRIDEYE_ADDRESS = 0x69;
const FRAMERATE_REGISTER = 0x02;
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
            const temperatures = this.getPixelTemperatures();
            const temperatureEdges = filters.applySobel(temperatures);
            const maxEdge = math.max(temperatureEdges);
            const isPresent = maxEdge >= this.settings.edgeThreshold;

            this.logger.debug(`Evaluating presence as ${isPresent} with a maximum edge of ${maxEdge}. Got temperatures:\n${temperatures}`);

            return isPresent;
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

        setFramerate1FPS() {
            this.setRegister(FRAMERATE_REGISTER, 1);
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

    async started() {
        this.i2cBus = i2c.openSync(this.settings.i2cDevice);
        this.setFramerate1FPS();
        this.updateInterval = setInterval(this.updateState, 1000);
    },

    async stopped() {
        clearInterval(this.updateInterval);
        this.i2cBus.closeSync();
    }
};
