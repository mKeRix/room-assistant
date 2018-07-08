#!/usr/bin/env bash
set -e

if [ "$TRAVIS_BRANCH" = "rewrite" ] || [ -z "$TRAVIS_TAG" ]; then
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin;

    docker run --rm \
           --privileged \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v ~/.docker:/root/.docker \
           -v "$TRAVIS_BUILD_DIR":/data \
           homeassistant/amd64-builder:latest \
           --$1 \
           -t /data
else
    docker run --rm \
           --privileged \
           -v ~/.docker:/root/.docker \
           -v "$TRAVIS_BUILD_DIR":/data \
           homeassistant/amd64-builder \
           --test \
           --$1 \
           -t /data
fi
