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
        echo "Seeding database..."
        if command -v ts-node >/dev/null 2>&1; then
            npm run db:seed
        else
            echo "ts-node not available in production build, skipping database seeding"
            echo "Database seeding should be done manually or in development environment"
        fi
        echo "Database seeding step completed!"
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