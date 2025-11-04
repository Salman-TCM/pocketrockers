#!/bin/bash
set -e

echo "🚀 Starting Backend Application..."

wait_for_db() {
    echo "Checking database connection..."
    until npx prisma db push --accept-data-loss 2>/dev/null; do
        echo "Waiting for database to be ready..."
        sleep 2
    done
    echo "Database is ready!"
}

run_migrations() {
    echo "Running database migrations..."
    npx prisma migrate deploy
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