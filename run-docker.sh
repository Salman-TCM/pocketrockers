#!/bin/bash

# Simple Docker run script for cross-platform compatibility
# This script works when docker-compose has issues

set -e

echo "🐳 Starting Playlist Application with Docker"

# Create network if it doesn't exist
docker network create playlist-network 2>/dev/null || true

# Build images
echo "📦 Building Docker images..."
docker build -t playlist-backend:latest ./backend
docker build -t playlist-frontend:latest ./frontend

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker stop playlist-backend playlist-frontend 2>/dev/null || true
docker rm playlist-backend playlist-frontend 2>/dev/null || true

# Create volume for database
docker volume create playlist-db 2>/dev/null || true

# Start backend
echo "🚀 Starting backend..."
docker run -d \
  --name playlist-backend \
  --network playlist-network \
  -p 4000:4000 \
  -v playlist-db:/app/prisma \
  -e DATABASE_URL=file:./dev.db \
  -e PORT=4000 \
  -e NODE_ENV=production \
  -e SEED_DATABASE=false \
  playlist-backend:latest

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:4000/health >/dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start"
    exit 1
  fi
  sleep 2
done

# Start frontend
echo "🌐 Starting frontend..."
docker run -d \
  --name playlist-frontend \
  --network playlist-network \
  -p 3001:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  playlist-frontend:latest

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
echo "🎉 Application is running!"
echo "Frontend: http://localhost:3001"
echo "Backend API: http://localhost:4000"
echo "Health Check: http://localhost:4000/health"
echo ""
echo "To stop the application, run: ./stop-docker.sh"
echo "To view logs, run:"
echo "  Backend: docker logs -f playlist-backend"
echo "  Frontend: docker logs -f playlist-frontend"