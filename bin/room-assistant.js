#!/usr/bin/env node
const version = require('../package.json').version;
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'config',
    description: 'Path to the config folder the software should load.',
    alias: 'c',
    type: String,
    defaultValue: './config'
  },
  {
    name: 'verbose',
    description: 'Turn on debugging output.',
    alias: 'v',
    type: Boolean
  }
];
const usage = commandLineUsage([
  {
    header: `room-assistant ${version}`,
    content:
      'A companion client for Home Assistant to handle presence detection and sensors in multiple rooms.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]);
const options = commandLineArgs(optionDefinitions);

if (options.help) {
  console.log(usage);
  return;
}

process.env.NODE_LOG_LEVEL = options.verbose
  ? 'verbose'
  : process.env.NODE_LOG_LEVEL || 'production';
process.env.NODE_CONFIG_DIR = options.config;

require('../dist/main');
