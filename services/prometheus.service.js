const promClient = require('prom-client');

module.exports = {
    name: 'prometheus',

    actions: {
        metrics(ctx) {
            ctx.meta.$responseType = 'text/plain';
            return promClient.register.metrics();
        }
    },

    created() {
        promClient.collectDefaultMetrics();
    }
};
