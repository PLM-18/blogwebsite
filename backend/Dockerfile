FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

RUN npm run build

# -- Production
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
EXPOSE 1337
ENV HOST 0.0.0.0

CMD ["npm", "start"]