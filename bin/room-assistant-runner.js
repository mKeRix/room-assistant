#!/usr/bin/env node

const _ = require('lodash');
const { spawn } = require('child_process');
const util = require('util');
const npm = require('global-npm');
const fs = require('fs');

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

        console.log(`Packages needed: ${toBeInstalled}`);

        resolve(toBeInstalled);
    });
}

function excludeCachedDependencies(toBeInstalled) {
    return getDependencyCache()
        .then(function (installed) {
            console.log(`Already installed: ${installed}`);

            return _.difference(toBeInstalled, installed);
        });
}

function getDependencyCache() {
    const readFile = util.promisify(fs.readFile);

    return readFile('dependencies.cache.json')
        .then(function (content) {
            return JSON.parse(content);
        })
        .catch(function (err) {
            Promise.resolve([]);
        })
}

function saveDependencyCache(installed) {
    const writeFile = util.promisify(fs.writeFile);

    if (installed && installed.length > 0) {
        return getDependencies()
            .then(function (dependencies) {
                return writeFile('dependencies.cache.json', JSON.stringify(dependencies));
            })
    }
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

const npmLoad = util.promisify(npm.load);
npmLoad({save: false})
    .then(getDependencies)
    .then(excludeCachedDependencies)
    .then(installDependencies)
    .then(saveDependencyCache)
    .then(runMoleculer)
    .catch(function (err) {
        console.error(err)
    });
