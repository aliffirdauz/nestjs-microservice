# Base image
FROM node:20-alpine

# Workdir
WORKDIR /app

# Copy package.json & install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build project
RUN npm run build

# Expose port
EXPOSE 3000

# Run
CMD ["npm", "run", "start:prod"]
