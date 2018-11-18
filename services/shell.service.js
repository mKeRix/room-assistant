'use strict';

const { exec } = require('child_process');
const config = require('config');
const slugify = require('slugify');
const util = require('util');

const CronService = require('moleculer-cron');
const DiscoveryService = require('../mixins/discovery.mixin');

module.exports = {
    name: 'shell',

    mixins: [CronService, DiscoveryService],

    crons: config.get('shell').map((command) => {
        return {
            name: slugify(command.command),
            cronTime: command.cron,
            onTick() {
                this.call('shell.executeAndPublish', command);
            },
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }),

    actions: {
        execute: {
            params: {
                command: 'string',
                regexp: { type: 'string', optional: true },
                number: { type: 'boolean', optional: true },
            },
            handler(ctx) {
                const execPromise = util.promisify(exec);

                return execPromise(ctx.params.command)
                    .then((output) => {
                        if (output.stderr) {
                            this.logger.warn(`${ctx.params.command} gave us an error: ${output.stderr}`);
                        }

                        if (output.stdout) {
                            const regex = new RegExp(ctx.params.regexp || '(.*)');
                            const matches = output.stdout.match(regex);

                            if (matches) {
                                return ctx.params.number ? Number(matches[1]) : matches[1];
                            }
                        }
                    })
                    .catch((err) => {
                        this.logger.error(`Error while executing ${ctx.params.command}: ${err}`);
                    });
            }
        },

        executeAndPublish: {
            params: {
                command: 'string',
                channel: 'string',
                regexp: { type: 'string', optional: true },
                number: { type: 'boolean', optional: true },
                retain: { type: 'boolean', optional: true }
            },
            handler(ctx) {
                ctx.call('shell.execute', ctx.params)
                    .then((match) =>  {
                        if (ctx.params.channel) {
                            const payload = {
                                channel: ctx.params.channel,
                                data: {
                                    value: match
                                },
                                options: {
                                    retain: ctx.params.retain
                                }
                            };

                            this.broker.emit('data.found', payload);
                        }
                    });
            }
        }
    },

    async started() {
        config.get('shell').forEach((command) => {
            this.registerSensor(command.channel, command.discoveryType, command.discoveryConfig);
        });
    },

    async stopped() {
        config.get('shell').forEach((command) => {
            this.unregisterSensor(command.channel, command.discoveryType);
        });
    }
};
