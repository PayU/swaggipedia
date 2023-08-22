######### UI #########
FROM node:18-alpine as builder

RUN mkdir -p /usr/ui
COPY /ui /usr/ui
WORKDIR /usr/ui

# Build UI from sources
RUN npm ci --silent
RUN PUBLIC_URL="@@@PUBLIC_URL@@@" npm run build

####### SERVICE #######
FROM node:18-alpine as production

RUN mkdir -p /usr/src
RUN chown -R node:node /usr
RUN chmod 755 /usr

WORKDIR /usr
# Bundle service source
COPY /src /usr/src
COPY /scripts /usr/scripts
COPY package*.json /usr/
COPY tsconfig.json /usr/
# Bundle ui source
COPY --from=builder /usr/ui/build /usr/src/ui/build
RUN chown -R node:node /usr/src/ui
RUN chown -R node:node /usr/scripts
RUN chmod 755 /usr/src/ui
RUN chmod 755 /usr/scripts

# Install app dependencies
RUN npm ci --production --silent

# Tell ts-node to Transpile only in order to preserve memory and allow faster start time
ENV TS_NODE_TRANSPILE_ONLY true
USER node

CMD ["npm", "start"]
