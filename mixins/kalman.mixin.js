'use strict';

const KalmanFilter = require('kalmanjs');

module.exports = {
    methods: {
        smoothData(item, value) {
            const kalman = this.kalmanMap.has(item) ? this.kalmanMap.get(item) : new KalmanFilter();

            if (!this.kalmanMap.has(item)) {
                this.kalmanMap.set(item, kalman);
            }

            return kalman.filter(value);
        }
    },

    created() {
        this.kalmanMap = new Map();
    }
};
