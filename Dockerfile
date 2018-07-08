FROM node:8-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]
