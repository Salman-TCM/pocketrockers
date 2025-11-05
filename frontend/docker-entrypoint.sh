#!/bin/bash
set -e

echo "🌐 Starting Frontend Application..."

# Function to wait for backend to be ready
wait_for_backend() {
    # For internal container communication, use the container name
    local backend_url="${INTERNAL_API_URL:-http://backend:4000}"
    echo "🔗 Checking backend connection at $backend_url..."
    
    local max_attempts=30
    local attempt=1
    
    until curl -f "$backend_url/health" >/dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
        echo "⏳ Waiting for backend to be ready... (attempt $attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "⚠️  Warning: Backend is not responding, but starting frontend anyway..."
    else
        echo "✅ Backend is ready!"
    fi
}

# Function to set up environment
setup_environment() {
    echo "🔧 Setting up environment..."
    
    # Set default environment variables if not provided
    export NODE_ENV="${NODE_ENV:-production}"
    export PORT="${PORT:-3000}"
    
    # Display environment info
    echo "📊 Environment: $NODE_ENV"
    echo "🚪 Port: $PORT"
    echo "🔗 API URL: ${NEXT_PUBLIC_API_URL:-http://backend:4000}"
}

# Main execution
main() {
    # Setup environment
    setup_environment
    
    # Wait for backend if in production mode
    if [ "$NODE_ENV" = "production" ]; then
        wait_for_backend
    fi
    
    echo "🎉 Frontend setup completed! Starting application..."
    
    # Execute the main command
    exec "$@"
}

# Run main function
main "$@"