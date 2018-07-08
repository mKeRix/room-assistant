'use strict';

const config = require('config');
const mqtt = require('mqtt');

module.exports = {
    name: 'mqtt',

    settings: {
        room: config.get('room'),

        url: config.get('mqtt.url'),
        options: {
            username: config.get('mqtt.username'),
            password: config.get('mqtt.password'),
            rejectUnauthorized: config.get('mqtt.rejectUnauthorized')
        }
    },

    events: {
        'data.found'(payload) {
            const subTopic = `${payload.channel}/${this.settings.room}`;

            this.client.publish(subTopic, JSON.stringify(payload.data), payload.options);
        }
    },

    created() {
        this.client = mqtt.connect(this.settings.url, this.settings.options);

        this.client.on('connect', () => {
            this.broker.logger.info(`Connected to ${this.settings.url}`);
        });
    }
};
