'use strict';

module.exports = {
    name: 'console',

    events: {
        'data.found'(payload) {
            this.broker.logger.info(`${payload.channel}:\n${payload.data}`);
        }
    }
};
