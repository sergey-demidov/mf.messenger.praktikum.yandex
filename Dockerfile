FROM node:12-slim
COPY ./ /app
WORKDIR /app
RUN npm ci && npm run build
