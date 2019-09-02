'use strict';

const _ = require('lodash');
const config = require('config');
const { exec } = require('child_process');
const util = require('util');

const KalmanService = require('../mixins/kalman.mixin');

module.exports = {
    name: 'bluetooth-inquiries',

    mixins: [KalmanService],

    dependencies: ['election'],

    settings: {
        addresses: config.get('bluetoothInquiries.addresses'),
        timeout: parseInt(config.get('bluetoothInquiries.timeout')) * 1000
    },

    events: {
        '$node.*'() {
            this.updateInquiringNodesCache();
        }
    },

    actions: {
        getDeviceRssi: {
            visibility: 'public',
            params: {
                address: 'string'
            },
            handler(ctx) {
                const execPromise = util.promisify(exec);

                return execPromise(`hcitool cc "${ctx.params.address}" && hcitool rssi "${ctx.params.address}"`)
                    .then(output => {
                        const regex = new RegExp(/-?[0-9]+/);
                        const matches = output.stdout.match(regex);

                        return matches.length > 0 ? matches[0] : undefined;
                    });
            }
        }
    },

    methods: {
        async updateState() {
            const isLeader = await this.broker.call('election.amILeader');
            if (!isLeader) {
                return;
            }

            this.gatherMeasurements();

            this.rssiMap.forEach((measurements, address) => {
                const now = new Date();
                const recentMeasurements = _.filter(measurements, measurement => now - measurement.timestamp < this.settings.timeout);
                const newState = recentMeasurements.length > 0 ? _.maxBy(recentMeasurements, 'rssi')['nodeId'] : 'not_home';

                if (this.stateMap.get(address) !== newState) {
                    this.stateMap.set(address, newState);

                    this.broker.emit('data.found', {
                        channel: `bluetooth-${address}`,
                        data: {
                            id: address,
                            state: newState
                        }
                    });
                }
            });
        },

        async gatherMeasurements() {
            const inquiries = _.zipObject(this.inquiringNodesCache.slice(0, this.settings.addresses.length), this.settings.addresses);
            _.forEach(inquiries, async (address, nodeId) => {
                const rssi = await this.broker.call('bluetooth-inquiries.getDeviceRssi', { address: address }, { nodeID: nodeId });
                const filteredRssi = this.smoothData(`${nodeId}-${address}`, rssi);

                console.log(`${address} RSSI: ${filteredRssi}`);

                this.rssiMap.get(address)[nodeId] = {
                    nodeId,
                    rssi: filteredRssi,
                    timestamp: new Date()
                };
            });

            this.rotate();
        },

        getInquiringNodes() {
            return this.broker.call('$node.services', { onlyAvailable: true })
                .then(services => {
                    const inquiryService = _.find(services, { name: this.name });
                    return inquiryService.nodes;
                });
        },

        async updateInquiringNodesCache() {
            this.inquiringNodesCache = await this.getInquiringNodes();
        },

        rotate() {
            if (this.inquiringNodesCache.length <= this.settings.addresses.length) {
                this.settings.addresses.unshift(this.settings.addresses.pop());
            } else {
                this.inquiringNodesCache.unshift(this.inquiringNodesCache.pop());
            }
        }
    },

    created() {
        this.inquiringNodesCache = [];
        this.stateMap = new Map();
        this.rssiMap = new Map();
        this.settings.addresses.forEach(address => {
            this.rssiMap.set(address, {});
        });
    },

    async started() {
        this.updateInterval = setInterval(this.updateState, 5 * 1000);
    },

    async stopped() {
        clearInterval(this.updateInterval);
    }
};