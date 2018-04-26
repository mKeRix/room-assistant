ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_REF
ARG BUILD_VERSION

LABEL \
    io.hass.name="room-assistant" \
    io.hass.description="room-assistant is a simple Node.js server for tracking presence and other things on a per-room basis." \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Heiko Rothe <me@heikorothe.com>"

RUN apk add --no-cache nodejs nodejs-npm python make g++ bluez libusb libusb-dev

COPY . /room-assistant
WORKDIR /room-assistant
RUN npm install -q --production && ln -s /data/options.json config/local.json

CMD [ "node", "index.js" ]
