FROM node:18-alpine

# Set working directory
WORKDIR /app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git python3

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=1337
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "dev"]