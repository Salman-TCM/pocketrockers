# Docker Setup Guide

This project is configured to work on any device OS with Docker support, including Windows, macOS, and Linux (x86_64 and ARM64 architectures).

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (optional, for cloning)

### Production Deployment

**Option 1: Using Simple Scripts (Recommended)**
```bash
# Build and start production services
./run-docker.sh

# Stop services
./stop-docker.sh

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:4000
```

**Option 2: Using Makefile/Docker Compose (if supported)**
```bash
# Build and start production services
make setup
# OR
docker-compose up -d --build

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:4000
```

### Development Environment

**Option 1: Using Simple Scripts (Recommended)**
```bash
# Start development environment with hot reload
./run-docker-dev.sh

# Stop development services
./stop-docker-dev.sh

# Access the application
# Frontend: http://localhost:3001 (with hot reload)
# Backend API: http://localhost:4000 (with hot reload)
```

**Option 2: Using Makefile/Docker Compose (if supported)**
```bash
# Start development environment with hot reload
make setup-dev
# OR
docker-compose -f docker-compose.dev.yml --profile development up -d --build

# Access the application
# Frontend: http://localhost:3001 (with hot reload)
# Backend API: http://localhost:4000 (with hot reload)
```

## Available Commands

### Using Makefile (Recommended)
```bash
# Production
make setup          # Initial setup and start
make build          # Build images
make up             # Start services
make down           # Stop services
make logs           # View logs
make restart        # Restart services

# Development
make setup-dev      # Initial dev setup
make dev            # Start dev environment
make dev-down       # Stop dev environment
make dev-logs       # View dev logs

# Utilities
make health         # Check service status
make clean          # Clean up Docker resources
make db-seed        # Seed database
```

### Using Docker Compose Directly

#### Production
```bash
# Build and start
docker-compose up -d --build

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --profile development up -d --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Architecture

### Services
- **Frontend**: Next.js application (Port 3000)
- **Backend**: NestJS API (Port 4000)
- **Database**: SQLite with Prisma ORM

### Cross-Platform Support
- **Multi-architecture builds**: Supports both x86_64 and ARM64
- **Platform-agnostic**: Works on Windows, macOS, and Linux
- **Optimized images**: Uses Alpine Linux for smaller image sizes
- **Security**: Non-root user execution

### Features
- **Health checks**: Automatic service health monitoring
- **Auto-restart**: Services restart automatically on failure
- **Hot reload**: Development environment supports code changes
- **Database migration**: Automatic database setup and migrations
- **Database seeding**: Optional database seeding on startup

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database file path
- `PORT`: Backend server port (default: 4000)
- `NODE_ENV`: Environment mode (development/production)
- `SEED_DATABASE`: Enable database seeding (true/false)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Frontend server port (default: 3000, exposed as 3001)

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   docker-compose ps
   # Change ports in docker-compose.yml if needed
   ```

2. **Permission issues on Windows**
   ```bash
   # Ensure Docker Desktop is running with proper permissions
   # Make sure file sharing is enabled for the project directory
   ```

3. **Build failures**
   ```bash
   # Clean build cache
   make clean
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Database issues**
   ```bash
   # Reset database (development only)
   make db-reset
   # Check database logs
   docker-compose logs backend
   ```

### Platform-Specific Notes

#### Windows
- Use PowerShell or Command Prompt
- Ensure WSL2 is enabled for Docker Desktop
- Make sure file paths don't exceed Windows limits

#### macOS
- Works with both Intel and Apple Silicon Macs
- Docker Desktop recommended

#### Linux
- Supports both x86_64 and ARM64 architectures
- Can use Docker Engine or Docker Desktop

## Development Workflow

1. **Start development environment**
   ```bash
   make setup-dev
   ```

2. **Make code changes**
   - Backend: Changes in `backend/src/` trigger automatic restart
   - Frontend: Changes trigger hot reload

3. **View logs**
   ```bash
   make dev-logs
   ```

4. **Stop development**
   ```bash
   make dev-down
   ```

## Production Deployment

1. **Build production images**
   ```bash
   make build
   ```

2. **Start production services**
   ```bash
   make up
   ```

3. **Monitor services**
   ```bash
   make health
   make logs
   ```

## Network Configuration

All services run on a custom Docker network (`app-network`) for secure inter-service communication. External access is only available through exposed ports.

## Volume Management

- **sqlite_data**: Persistent database storage
- **Development volumes**: Source code mounted for hot reload

For more information, see the main README.md file.