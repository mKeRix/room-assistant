'use strict';

const config = require('config');
const i2c = require('i2c-bus');

const GRIDEYE_ADDRESS = 0x69;
const TEMPERATURE_REGISTER_START = 0x80;

module.exports = {
    name: 'grideye',

    settings: {
        i2cDevice: config.get('grideye.i2cDevice')
    },

    methods: {
        getPixelTemperatures() {
            for (let i = 0; i < 64; i++) {
                const temperature = this.getPixelTemperature(i);
                console.log(temperature);
            }
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
        }
    },

    async started() {
        this.i2cBus = i2c.openSync(this.settings.i2cDevice);
        this.updateInterval = setInterval(this.getPixelTemperatures, 500);
    },

    async stopped() {
        clearInterval(this.updateInterval);
        this.i2cBus.closeSync();
    }
};
