FROM node:12-slim

WORKDIR /usr/src/app

COPY . .

RUN npm ci && npm run build

CMD ["node", "server.js"]