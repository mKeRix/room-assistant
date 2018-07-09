FROM arm32v6/node:8-alpine

COPY travis/qemu-arm-static /usr/bin/

RUN apk add --no-cache python git make g++ bluez libusb libusb-dev

COPY . /room-assistant
WORKDIR /room-assistant

RUN npm install --production

CMD [ "npm", "start" ]
