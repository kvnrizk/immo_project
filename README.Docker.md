# Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start all services (Frontend, Backend, PostgreSQL)
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This will start:
- **PostgreSQL Database** on `localhost:5432`
- **Backend API** on `localhost:5001`
- **Frontend** on `localhost:8080`

### 2. Initialize Database

After containers are running, initialize the database:

```bash
# Enter the backend container
docker exec -it immo_backend sh

# Run database initialization
cd /app
node src/config/initDatabase.js

# Exit container
exit
```

### 3. Access Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001/api
- **Admin Dashboard**: http://localhost:8080/login
  - Username: `admin`
  - Password: `admin7264`

## Docker Commands

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres

# Rebuild a specific service
docker-compose up -d --build backend
```

## Production Deployment

### Using Docker

1. **Update environment variables** in `docker-compose.yml`
2. **Set production database credentials**
3. **Deploy to cloud**:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

### Docker Hub (Optional)

```bash
# Tag images
docker tag immo_frontend:latest yourusername/immo-frontend:latest
docker tag immo_backend:latest yourusername/immo-backend:latest

# Push to Docker Hub
docker push yourusername/immo-frontend:latest
docker push yourusername/immo-backend:latest
```

## Environment Variables

Create `.env` files for production:

### Backend `.env` (server/.env)
```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=immo_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
PORT=5001
NODE_ENV=production
```

### Frontend `.env`
```
VITE_API_URL=http://your-api-domain.com/api
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View PostgreSQL logs
docker logs immo_postgres

# Connect to PostgreSQL directly
docker exec -it immo_postgres psql -U postgres -d immo_db
```

### Backend Issues
```bash
# View backend logs
docker logs immo_backend

# Restart backend
docker-compose restart backend
```

### Frontend Issues
```bash
# View frontend logs
docker logs immo_frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. To backup:

```bash
# Backup database
docker exec immo_postgres pg_dump -U postgres immo_db > backup.sql

# Restore database
cat backup.sql | docker exec -i immo_postgres psql -U postgres immo_db
```
