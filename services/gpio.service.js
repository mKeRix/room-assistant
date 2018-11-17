'use strict';

const config = require('config');
const Gpio = require('onoff').Gpio;

module.exports = {
    name: 'gpio',

    settings: {
        ports: config.get('gpio')
    },

    methods: {
        handleGpioEvent(err, value, port) {
            if (err) {
                this.logger.error(`The gpio watcher raised an error: ${err}`);
            }

            const payload = {
                channel: port.channel,
                data: {
                    value: value
                },
                options: {
                    retain: port.retain
                }
            };

            this.broker.emit('data.found', payload);
        }
    },

    created() {
        this.gpioMap = new Map();

        this.settings.ports.forEach((port) => {
            const gpio = new Gpio(port.pin, 'in', 'both');
            gpio.watch((err, value) => {
                this.handleGpioEvent(err, value, port);
            });

            this.gpioMap.set(port.pin, gpio);
        });
    },

    async started() {
        this.settings.ports.forEach((port) => {
            const details = {
                channel: port.channel,
                discoverable: true,
                discoveryType: port.discoveryType,
                discoveryConfig: port.discoveryConfig
            };

            this.broker.emit('sensor.started', details);
        });
    },

    async stopped() {
        this.gpioMap.forEach(function (gpio) {
            gpio.unexport();
        });
    }
};
