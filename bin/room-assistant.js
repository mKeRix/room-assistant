#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('../package.json');
require('please-upgrade-node')(pkg);
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean,
  },
  {
    name: 'config',
    description: 'Path to the config folder the software should load.',
    alias: 'c',
    type: String,
    defaultValue: './config',
  },
  {
    name: 'digResolver',
    description:
      'Use dig to resolve mdns hostnames instead of the native getaddrinfo.',
    type: Boolean,
  },
  {
    name: 'verbose',
    description: 'Turn on debugging output.',
    alias: 'v',
    type: Boolean,
  },
];
const usage = commandLineUsage([
  {
    header: `room-assistant ${pkg.version}`,
    content:
      'A companion client for Home Assistant to handle presence detection and sensors in multiple rooms.',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]);
const options = commandLineArgs(optionDefinitions);

if (options.help) {
  console.log(usage);
  return;
}

process.env.NODE_LOG_LEVEL = options.verbose
  ? 'debug'
  : process.env.NODE_LOG_LEVEL || 'info';
process.env.NODE_CONFIG_DIR = options.config;

if (options.digResolver) {
  process.env.NODE_DIG_RESOLVER = true;
}

require('../dist/main');
