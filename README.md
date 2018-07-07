[![Moleculer](https://img.shields.io/badge/Powered%20by-Moleculer-green.svg?colorB=0e83cd)](https://moleculer.services)

# room-assistant

room-assistant is a simple Node.js server for tracking presence and other things on a per-room basis.
Currently it is mainly meant to be used for the [mqtt_room](https://home-assistant.io/components/sensor.mqtt_room/) component of [Home Assistant](https://home-assistant.io/).

## Important note

You are currently looking at an early stage version of my rewriting efforts. **This version is only intended for development purposes!**

## Build Setup

``` bash
# Install dependencies
npm install

# Start developing with REPL
npm run dev

# Start production
npm start

# Run unit tests
npm test

# Run continuous test mode
npm run ci

# Run ESLint
npm run lint
```

## Run in Docker

```bash
$ docker-compose up -d --build
```
