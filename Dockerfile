# Frontend Dockerfile
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Backend + Frontend Runtime
FROM node:18-alpine

WORKDIR /app

# Install serve to serve frontend static files
RUN npm install -g serve

# Copy backend
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install
COPY server/ .

# Copy built frontend
WORKDIR /app
COPY --from=frontend-build /app/dist ./dist

# Expose ports
EXPOSE 5001 8080

# Start script
COPY docker-start.sh /app/
RUN chmod +x /app/docker-start.sh

CMD ["/app/docker-start.sh"]
