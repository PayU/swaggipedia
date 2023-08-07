# NODE container which runs this service
FROM node:18-alpine as builder

RUN mkdir -p /usr/ui

COPY /ui /usr/ui

WORKDIR /usr/ui

# Build UI from sources
RUN npm ci --silent

# Tell ts-node to Transpile only in order to preserve memory and allow faster start time
ENV TS_NODE_TRANSPILE_ONLY true
ENV NODE_ENV=production

RUN npm run build

FROM node:18-alpine as production

RUN mkdir -p /usr/src

WORKDIR /usr

# Install app dependencies
COPY package*.json /usr/
COPY tsconfig.json /usr/

RUN npm ci --production --silent
## Bundle app source
COPY /src /usr/src
COPY --from=builder /usr/ui/build /usr/src/ui/build

USER node

ENTRYPOINT ["node", "-r", "ts-node/register", "-r", "dotenv/config", "src/index.ts"]
