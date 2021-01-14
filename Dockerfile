FROM node:12-slim

WORKDIR /usr/src/app

RUN ls && npm ci && npm run build

CMD ["node", "server.js"]