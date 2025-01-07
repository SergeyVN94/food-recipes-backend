FROM node:23-alpine as base
WORKDIR /app
COPY package*.json /app/
RUN npm ci

FROM node:23-alpine as builder
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
RUN npm run build

FROM node:23-alpine as runner
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ARG PORT
ARG HOSTNAME
ENV PORT=$PORT
ENV HOSTNAME=$HOSTNAME
EXPOSE $PORT
CMD ["node", "./main.js"]
