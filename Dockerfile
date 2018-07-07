FROM node:8-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]
