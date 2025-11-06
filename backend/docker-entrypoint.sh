#!/bin/bash
set -e

echo "🚀 Starting Backend Application..."

wait_for_db() {
    echo "Checking database connection..."
    # Check if database file exists
    if [ ! -f ./prisma/dev.db ]; then
        echo "Database does not exist, creating..."
        npx prisma db push --accept-data-loss
    else
        echo "Database already exists, checking connection..."
        npx prisma generate
    fi
    echo "Database is ready!"
}

run_migrations() {
    echo "Running database migrations..."
    # Use migrate dev which handles both schema push and migration history
    if [ "$NODE_ENV" = "development" ]; then
        npx prisma migrate dev --name init || npx prisma db push
    else
        # In production, try migrate deploy first, fallback to db push
        npx prisma migrate deploy || npx prisma db push --accept-data-loss
    fi
    echo "Migrations completed!"
}

seed_database() {
    if [ "$SEED_DATABASE" = "true" ]; then
        echo "🎵 Loading demo songs for SyncPlay..."
        
        # The seed script will check if database is already populated
        if npm run db:seed; then
            echo "✅ Demo songs loaded successfully!"
        elif [ -f "dist/prisma/seed.js" ] && node dist/prisma/seed.js; then
            echo "✅ Demo songs loaded successfully using compiled script!"
        else
            echo "⚠️  Could not load demo songs automatically"
            echo "   You can manually run: npm run db:seed"
            echo "   Or use the demo script: ./demo-enhanced-player.sh"
        fi
    else
        echo "💡 Skipping demo song loading (SEED_DATABASE=false)"
        echo "   Set SEED_DATABASE=true to automatically load demo tracks"
    fi
}

main() {
    wait_for_db
    run_migrations
    seed_database
    echo "🎉 Backend setup completed! Starting application..."
    exec "$@"
}
main "$@"