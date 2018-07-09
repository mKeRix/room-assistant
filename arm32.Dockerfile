FROM arm32v6/node:8-alpine

COPY qemu-arm-static /usr/bin/qemu-arm-static

RUN apk add --no-cache python git make g++ bluez libusb libusb-dev

COPY . /room-assistant
WORKDIR /room-assistant

RUN npm install --production

CMD [ "npm", "start" ]
