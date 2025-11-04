#!/bin/bash

# Development Docker run script with hot reload
# This script works when docker-compose has issues

set -e

echo "🛠️  Starting Playlist Application in Development Mode"

# Create network if it doesn't exist
docker network create playlist-network 2>/dev/null || true

# Build development images
echo "📦 Building development Docker images..."
docker build -f ./backend/Dockerfile.dev -t playlist-backend:dev ./backend
docker build -f ./frontend/Dockerfile.dev -t playlist-frontend:dev ./frontend

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker stop playlist-backend-dev playlist-frontend-dev 2>/dev/null || true
docker rm playlist-backend-dev playlist-frontend-dev 2>/dev/null || true

# Create volume for database
docker volume create playlist-db 2>/dev/null || true

# Start backend in development mode
echo "🚀 Starting backend in development mode..."
docker run -d \
  --name playlist-backend-dev \
  --network playlist-network \
  -p 4000:4000 \
  -v "$(pwd)/backend:/app" \
  -v /app/node_modules \
  -v /app/dist \
  -v playlist-db:/app/prisma \
  -e DATABASE_URL=file:./dev.db \
  -e PORT=4000 \
  -e NODE_ENV=development \
  -e SEED_DATABASE=true \
  playlist-backend:dev \
  docker-entrypoint.sh npm run start:dev

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:4000/health >/dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start"
    echo "Backend logs:"
    docker logs playlist-backend-dev
    exit 1
  fi
  sleep 2
done

# Start frontend in development mode
echo "🌐 Starting frontend in development mode..."
docker run -d \
  --name playlist-frontend-dev \
  --network playlist-network \
  -p 3001:3000 \
  -v "$(pwd)/frontend:/app" \
  -v /app/node_modules \
  -v /app/.next \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  playlist-frontend:dev \
  docker-entrypoint.sh npm run dev

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Frontend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "⚠️  Frontend may not be ready yet, but continuing..."
    break
  fi
  sleep 2
done

echo ""
echo "🎉 Development environment is running!"
echo "Frontend: http://localhost:3001 (with hot reload)"
echo "Backend API: http://localhost:4000 (with hot reload)"
echo "Health Check: http://localhost:4000/health"
echo ""
echo "To stop the application, run: ./stop-docker-dev.sh"
echo "To view logs, run:"
echo "  Backend: docker logs -f playlist-backend-dev"
echo "  Frontend: docker logs -f playlist-frontend-dev"