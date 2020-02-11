FROM node:12-alpine as build
ARG ROOM_ASSISTANT_VERSION=latest

RUN apk add --no-cache python make g++ libusb-dev eudev-dev avahi-dev
RUN npm install -g --unsafe-perm room-assistant@$ROOM_ASSISTANT_VERSION

FROM node:12-alpine

WORKDIR /room-assistant

RUN apk add --no-cache supervisor bluez bluez-deprecated libusb avahi avahi-dev dmidecode \
    && mkdir -p /var/run/dbus \
    && setcap cap_net_raw+eip $(eval readlink -f `which node`) \
    && setcap cap_net_raw+eip $(eval readlink -f `which hcitool`) \
    && addgroup --gid 998 i2c \
    && addgroup node i2c \
    && ln -s /usr/local/lib/node_modules/room-assistant/bin/room-assistant.js /usr/local/bin/room-assistant
COPY docker/supervisord.conf docker/entrypoint.sh /etc/
COPY --from=build /usr/local/lib/node_modules/room-assistant /usr/local/lib/node_modules/room-assistant

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/etc/entrypoint.sh"]
