#!/usr/bin/env bash
set -e

if [ -n "$TRAVIS_TAG" ]; then
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin;

    if [ "$HASSIO" = "true" ]; then
        docker run --rm \
               --privileged \
               -v /var/run/docker.sock:/var/run/docker.sock \
               -v ~/.docker:/root/.docker \
               -v "$TRAVIS_BUILD_DIR":/data \
               homeassistant/amd64-builder:latest \
               --$PLATFORM \
               -t /data
    else
        if [ "$PLATFORM" != "amd64" ]; then
            TAG_ADDON = "-$PLATFORM"
        fi

        docker build -t mkerix/room-assistant:${TRAVIS_TAG}${TAG_ADDON} -t mkerix/room-assistant:latest${TAG_ADDON} -f $PLATFORM.Dockerfile .
        docker push mkerix/room-assistant:${TRAVIS_TAG}${TAG_ADDON}
        docker push mkerix/room-assistant:latest${TAG_ADDON}
    fi
else
    if [ "$HASSIO" = "true" ]; then
        docker run --rm \
                   --privileged \
                   -v /var/run/docker.sock:/var/run/docker.sock \
                   -v "$TRAVIS_BUILD_DIR":/data \
                   homeassistant/amd64-builder \
                   --test \
                   --$PLATFORM \
                   -t /data
    else
        docker build -f $PLATFORM.Dockerfile .
    fi
fi
