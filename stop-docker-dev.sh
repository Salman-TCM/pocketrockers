#!/bin/bash

# Stop development Docker containers

echo "🛑 Stopping Development Environment..."

# Stop and remove containers
docker stop playlist-backend-dev playlist-frontend-dev 2>/dev/null || true
docker rm playlist-backend-dev playlist-frontend-dev 2>/dev/null || true

echo "✅ Development environment stopped successfully!"
echo ""
echo "To start again, run: ./run-docker-dev.sh"
echo "To clean up completely (including database), run:"
echo "  docker volume rm playlist-db"
echo "  docker network rm playlist-network"