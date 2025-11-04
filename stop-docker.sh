#!/bin/bash

# Stop production Docker containers

echo "🛑 Stopping Playlist Application..."

# Stop and remove containers
docker stop playlist-backend playlist-frontend 2>/dev/null || true
docker rm playlist-backend playlist-frontend 2>/dev/null || true

echo "✅ Application stopped successfully!"
echo ""
echo "To start again, run: ./run-docker.sh"
echo "To clean up completely (including database), run:"
echo "  docker volume rm playlist-db"
echo "  docker network rm playlist-network"