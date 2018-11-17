'use strict';

module.exports = {
    methods: {
        registerSensor(channel, type, config) {
            this.waitForServices('mqtt', 10 * 1000)
                .then(() => {
                    const details = {
                        channel: channel,
                        discoveryType: type,
                        discoveryConfig: config
                    };

                    this.broker.emit('sensor.started', details);
                });
        },

        unregisterSensor(channel, type) {
            this.broker.emit('sensor.stopped', { channel, discoveryType: type });
        }
    }
};
