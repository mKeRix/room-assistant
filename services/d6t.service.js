'use strict';

const config = require('config');
const d6t = require('d6t').d6t;

const DiscoveryService = require('../mixins/discovery.mixin');

module.exports = {
    name: 'd6t',

    mixins: [DiscoveryService],

    settings: {
        channel: config.get('d6t.channel'),
        type: config.get('d6t.type'),
        interval: config.get('d6t.interval'),
        threshold: config.get('d6t.threshold'),
        onlyChanges: config.get('d6t.onlyChanges'),
        retain: config.get('d6t.retain'),
        discoveryType: config.get('d6t.discoveryType'),
        discoveryConfig: config.get('d6t.discoveryConfig')
    },

    methods: {
        querySensor() {
            const data = d6t.d6t_read_js(this.d6tDevh);
            const presence = data.slice(1, -1).some(temp => temp >= this.settings.threshold);

            if (this.presence !== presence || !this.settings.onlyChanges) {
                this.presence = presence;

                const payload = {
                    channel: 'd6t',
                    data: {
                        value: presence,
                        raw: data
                    },
                    options: {
                        retain: this.settings.retain
                    }
                };
                this.broker.emit('data.found', payload);
            }
        }
    },

    created() {
        this.presence = null;
        this.d6tDevh = new d6t.d6t_devh_t();
    },

    async started() {
        this.registerSensor(this.settings.channel, this.settings.discoveryType, this.settings.discoveryConfig);

        const sensorType = d6t[this.settings.type];
        d6t.d6t_open_js(this.d6tDevh, sensorType, null);

        this.interval = setInterval(this.querySensor, this.settings.interval);
    },

    async stopped() {
        clearInterval(this.interval);

        d6t.d6t_close_js(this.d6tDevh);

        this.unregisterSensor(this.settings.channel, this.settings.discoveryType);
    }
};
