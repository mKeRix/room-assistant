#!/usr/bin/env node

const _ = require('lodash');
const { spawn } = require('child_process');
const util = require('util');
const npm = require('global-npm');

const dependencies = require('../dependencies');

function getDependencies() {
    return new Promise(function (resolve, reject) {
        const services = process.env.SERVICES;
        let toBeInstalled = dependencies;

        if (services) {
            console.log(`Installing dependencies for: ${services}`);
            toBeInstalled = _.pick(toBeInstalled, services.split(','))
        }
        toBeInstalled = _.flatMap(toBeInstalled, (module) => module);

        console.log(`Packages to be installed: ${toBeInstalled}`);

        resolve(toBeInstalled);
    });
}


const npmLoad = util.promisify(npm.load);
npmLoad()
    .then(getDependencies)
    .then(function (toBeInstalled) {
        if (toBeInstalled.length > 0) {
            const npmInstall = util.promisify(npm.commands.install);
            return npmInstall(toBeInstalled);
        }
    })
    .then(function () {
        spawn('moleculer-runner', process.argv.slice(2), { stdio: 'inherit'} );
    })
    .catch(function (err) {
        console.error(err)
    });
