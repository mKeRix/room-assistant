'use strict';

const _ = require('lodash');
const config = require('config');
const { ServiceNotFoundError, ServiceNotAvailableError } = require('moleculer').Errors;

module.exports = {
    name: 'election',

    dependencies: ['$node'],

    settings: {
        majoritySize: config.get('election.majoritySize')
    },

    events: {
        'election.leadership.request'() {
            this.updateLeadershipState();
        },

        'election.leadership.confirm'(payload) {
            this.currentLeaderNodeId = payload.nodeId;
            this.logger.info(`Accepted ${payload.nodeId} as leader.`);
        },

        'election.leadership.resign'(payload) {
            if (this.currentLeaderNodeId === payload.nodeId) {
                this.currentLeaderNodeId = null;
                this.requestLeadership();
            }
        },

        '$node.disconnected'(payload) {
            const nodeId = payload.node.id;

            if (nodeId === this.currentLeaderNodeId) {
                this.startElection();
            }

            if (this.acceptedVoters.has(nodeId)) {
                this.acceptedVoters.delete(nodeId);
                this.updateLeadershipState();
            }
        }
    },

    actions: {
        acceptVote: {
            visibility: 'public',
            handler(ctx) {
                this.acceptedVoters.add(ctx.nodeID);
                this.updateLeadershipState();
            }
        },

        rescindVote: {
            visibility: 'public',
            handler(ctx) {
                this.acceptedVoters.delete(ctx.nodeID);
                this.updateLeadershipState();
            }
        },

        amILeader: {
            visibility: 'protected',
            handler(ctx) {
                return this.currentLeaderNodeId === ctx.broker.nodeID;
            }
        }
    },

    methods: {
        updateLeadershipState() {
            if (this.leadershipCriteriaFulfilled()) {
                this.broker.broadcast('election.leadership.confirm', {
                    nodeId: this.broker.nodeID
                });
            } else if (this.currentLeaderNodeId === this.broker.nodeID) {
                this.broker.broadcast('election.leadership.resign', {
                    nodeId: this.broker.nodeID
                });
            }
        },

        leadershipCriteriaFulfilled() {
            return this.acceptedVoters.size >= this.settings.majoritySize
                && this.leaderVoteNodeId === this.broker.nodeID;
        },

        requestLeadership() {
             this.broker.broadcast('election.leadership.request', {});

             new Promise((resolve) => setTimeout(resolve, 2 * 1000))
                .then(() => {
                    if (this.currentLeaderNodeId == null) {
                        this.startElection();
                    } else {
                        return this.currentLeaderNodeId;
                    }
                });

            setTimeout(() => {
                // repeat until we have a new leader
                if (this.currentLeaderNodeId == null) {
                    this.requestLeadership();
                }
            }, 30 * 1000);
        },

        async startElection() {
            const newLeaderId = await this.determineNewLeader();
            this.castVote(newLeaderId);
        },

        determineNewLeader() {
            return this.broker.call('$node.services')
                .then(services => {
                    const electionService = _.find(services, { name: 'election' });
                    const nodeIds = electionService.nodes;
                    nodeIds.sort();

                    return nodeIds[0];
                });
        },

        castVote(nodeId) {
            if (this.leaderVoteNodeId != null) {
                this.logger.info(`Rescinding vote for ${this.leaderVoteNodeId}.`);
                this.broker.call('election.rescindVote', {}, { nodeID: this.leaderVoteNodeId })
                    .catch(error => {
                        if (!(error instanceof ServiceNotFoundError || error instanceof ServiceNotAvailableError)) {
                            // we can ignore service availability issues, these occur when the node we voted for has gone offline
                            // other stuff we still need to throw
                            throw error;
                        }
                    });
            }

            this.logger.info(`Voting for ${nodeId} as the new leader.`);
            this.leaderVoteNodeId = nodeId;
            return this.broker.call('election.acceptVote', {}, { nodeID: nodeId });
        }
    },

    created() {
        this.currentLeaderNodeId = null;
        this.leaderVoteNodeId = null;
        this.acceptedVoters = new Set();
    },

    async started() {
        this.requestLeadership();
    }
};
