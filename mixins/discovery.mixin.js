'use strict';

module.exports = {
    methods: {
        registerSensor(channel, type, config) {
            this.waitForServices('mqtt', 5 * 1000)
                .then(() => {
                    const details = {
                        channel: channel,
                        discoveryType: type,
                        discoveryConfig: config
                    };

                    this.broker.emit('sensor.started', details);
                })
                .catch(err => {
                    this.logger.debug('Could not send auto discovery info, waiting for MQTT service timed out', err);
                });
        },

        unregisterSensor(channel, type) {
            this.broker.emit('sensor.stopped', { channel, discoveryType: type });
        }
    }
};
