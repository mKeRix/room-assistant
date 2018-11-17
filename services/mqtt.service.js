'use strict';

const config = require('config');
const mqtt = require('mqtt');

module.exports = {
    name: 'mqtt',

    settings: {
        room: config.get('room'),
        discoveryEnabled: config.get('autoDiscovery'),

        url: config.get('mqtt.url'),
        options: {
            username: config.get('mqtt.username'),
            password: config.get('mqtt.password'),
            rejectUnauthorized: config.get('mqtt.rejectUnauthorized')
        }
    },

    events: {
        'sensor.started'(details) {
            if (this.settings.discoveryEnabled) {
                const baseTopic = `homeassistant/${details.discoveryType}/${this.settings.room}/${details.channel}`;
                this.channelRegistry[details.channel] = `${baseTopic}/state`;

                this.logger.debug(`Sending discovery info to ${baseTopic}/config`);
                this.client.publish(`${baseTopic}/config`, JSON.stringify(details.discoveryConfig), { retain: true });
            }
        },

        'sensor.stopped'(details) {
            if (this.settings.discoveryEnabled) {
                delete this.channelRegistry[details.channel];

                const configTopic = `homeassistant/${details.discoveryType}/${this.settings.room}/${details.channel}`;
                this.logger.debug(`Removing discovery config from ${configTopic}`);
                this.client.publish(configTopic, null, { retain: true });
            }
        },

        'data.found'(payload) {
            let subTopic = `${payload.channel}/${this.settings.room}`;

            if (this.channelRegistry.hasOwnProperty(payload.channel)) {
                subTopic = this.channelRegistry[payload.channel];
            }

            this.client.publish(subTopic, JSON.stringify(payload.data), payload.options);
        }
    },

    created() {
        this.channelRegistry = {};

        this.client = mqtt.connect(this.settings.url, this.settings.options);
        this.client.on('connect', () => {
            this.logger.info(`Connected to ${this.settings.url}`);
        });
    }
};
