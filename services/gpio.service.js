'use strict';

const config = require('config');
const Gpio = require('onoff').Gpio;

const DiscoveryService = require('../mixins/discovery.mixin');

module.exports = {
    name: 'gpio',

    mixins: [DiscoveryService],

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
            this.registerSensor(port.channel, port.discoveryType, port.discoveryConfig);
        });
    },

    async stopped() {
        this.gpioMap.forEach(function (gpio) {
            gpio.unexport();
        });

        this.settings.ports.forEach((port) => {
            this.unregisterSensor(port.channel, port.discoveryType);
        });
    }
};
