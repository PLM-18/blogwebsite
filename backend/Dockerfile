FROM node:22.15.0-alpine3.18

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH=/opt/node_modules/.bin:$PATH

RUN npm install
WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node
RUN cd node_modules/better-sqlite3 && npm run build
RUN ["npm", "run", "build"]

EXPOSE 1337

CMD ["npm", "run", "dev"]
