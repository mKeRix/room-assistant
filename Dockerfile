ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_REF
ARG BUILD_VERSION

RUN apk add --no-cache nodejs nodejs-npm python git make g++ bluez libusb libusb-dev

COPY . /room-assistant
WORKDIR /room-assistant
RUN npm install --production && ln -s /data/options.json config/local.json

CMD [ "node", "index.js" ]
