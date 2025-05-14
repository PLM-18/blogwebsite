FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port NuxtJS will run on
ENV PORT=3000
EXPOSE 3000

ENV STRAPI_URL=http://strapi:1337

CMD ["npm", "run", "start"]