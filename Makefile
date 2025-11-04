
.PHONY: help build up down logs clean dev prod restart health

help:
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

dev:
	docker-compose -f docker-compose.dev.yml --profile development up -d

dev-build:
	docker-compose -f docker-compose.dev.yml --profile development up -d --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

restart: 
	docker-compose restart

health: 
	docker-compose ps

clean:
	docker-compose down -v
	docker system prune -f
	docker volume prune -f


db-reset: 
	docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate reset

db-seed: 
	docker-compose exec backend npm run db:seed

build-multi: 
	docker buildx build --platform linux/amd64,linux/arm64 -t playlist-backend ./backend
	docker buildx build --platform linux/amd64,linux/arm64 -t playlist-frontend ./frontend

setup: 
	@echo "🚀 Setting up the application..."
	make build
	make up
	@echo "✅ Application is ready at http://localhost:3000"

setup-dev:
	@echo "🛠️  Setting up development environment..."
	make dev-build
	@echo "✅ Development environment is ready at http://localhost:3000"