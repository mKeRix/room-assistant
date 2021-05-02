FROM node:16-alpine as build
WORKDIR /room-assistant

RUN apk add --no-cache python make g++ libusb-dev eudev-dev avahi-dev
COPY ./*.tgz /room-assistant/
RUN npm install -g --unsafe-perm *.tgz

FROM node:16-alpine

WORKDIR /room-assistant

RUN apk add --no-cache bluez bluez-deprecated libusb avahi-dev bind-tools dmidecode tini curl \
    && setcap cap_net_raw+eip $(eval readlink -f `which node`) \
    && setcap cap_net_raw+eip $(eval readlink -f `which hcitool`) \
    && setcap cap_net_admin+eip $(eval readlink -f `which hciconfig`) \
    && ln -s /usr/local/lib/node_modules/room-assistant/bin/room-assistant.js /usr/local/bin/room-assistant
RUN npm install -g winston-loki winston-elasticsearch
COPY --from=build /usr/local/lib/node_modules/room-assistant /usr/local/lib/node_modules/room-assistant

ENTRYPOINT ["tini", "--", "room-assistant"]
CMD ["--digResolver"]
HEALTHCHECK --start-period=15s CMD curl --fail http://localhost:6415/status/ || exit 1
