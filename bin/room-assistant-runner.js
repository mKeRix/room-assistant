#!/usr/bin/env node

const _ = require('lodash');
const { spawn } = require('child_process');
const config = require('config');
const util = require('util');
const npm = require('global-npm');

const dependencies = require('../dependencies');

function getDependencies() {
    return new Promise(function (resolve) {
        const services = process.env.SERVICES;
        let toBeInstalled = dependencies;

        if (services) {
            console.log(`Installing dependencies for: ${services}`);
            toBeInstalled = _.pick(toBeInstalled, services.split(','))
        }
        toBeInstalled = _.flatMap(toBeInstalled, (module) => module);

        console.log(`Packages needed: ${toBeInstalled}`);

        resolve(toBeInstalled);
    });
}

function excludeInstalledDependencies(toBeInstalled) {
    const npmLs = util.promisify(npm.commands.ls);

    return npmLs(toBeInstalled, true)
        .then(function (list) {
            const installed = _.flatMap(list.dependencies, dependency => dependency._id);
            const diff = _.difference(toBeInstalled, installed);

            console.log(`Already installed: ${installed}`);
            console.log(`Now installing: ${diff}`);

            return diff;
        });
}

function installDependencies(toBeInstalled) {
    if (toBeInstalled.length > 0) {
        const npmInstall = util.promisify(npm.commands.install);
        return npmInstall(toBeInstalled);
    }
}

function runMoleculer() {
    spawn('moleculer-runner', process.argv.slice(2), { stdio: 'inherit'} );
}

/* main script */

process.env.SERVICES = process.env.SERVICES || config.get('services').join(',');
process.env.SERVICEDIR = process.env.SERVICEDIR || 'services';

const npmLoad = util.promisify(npm.load);
npmLoad({save: false, 'package-lock': false})
    .then(getDependencies)
    .then(excludeInstalledDependencies)
    .then(installDependencies)
    .then(runMoleculer)
    .catch(function (err) {
        console.error(err);
    });
