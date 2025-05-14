FROM node:22.15.0-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NUXT_PUBLIC_STRAPI_URL=http://strapi:1337

CMD ["npm", "run", "dev"]