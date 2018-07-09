FROM arm32v7/node:8-slim

RUN apt-get update  \
    && apt-get install -y python build-essential bluetooth bluez libbluetooth-dev libudev-dev libusb-1.0-0-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . /room-assistant
WORKDIR /room-assistant

RUN npm install --production

CMD [ "npm", "run", "docker" ]
