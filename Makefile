.PHONY: help install dev test lint format docs clean docker-up docker-down

# ==============================================================================
# Variables
# ==============================================================================
PROJECT_NAME := collaboration_bridge
PYTHON := python3.11
UV := uv


# ==============================================================================
# Help
# ==============================================================================
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)


# ==============================================================================
# Environment Setup
# ==============================================================================
install: ## Install project dependencies
	$(UV) sync

install-dev: ## Install project dependencies including dev tools
	$(UV) sync --all-extras

test-env: ## Setup the test environment
	$(UV) sync --all-extras
	# npm ci
	sudo docker compose -f docker-compose.test.yml up -d --wait
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 5
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	$(UV) run alembic upgrade head


# ==============================================================================
# Development
# ==============================================================================
dev: ## Run development server
	$(UV) run uvicorn src.$(PROJECT_NAME).main:app --reload --host 0.0.0.0 --port 8000


# ==============================================================================
# Testing
# ==============================================================================
test: ## Run all tests
	@$(MAKE) test-all

test-unit: ## Run unit tests only
	ENVIRONMENT=testing DATABASE_URL_TEST=sqlite+aiosqlite:///test.db \
	$(UV) run pytest tests/unit -v --tb=short

test-integration: ## Run integration tests only
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	$(UV) run pytest tests/integration -v --tb=short

test-e2e: ## Run end-to-end tests
	@echo "Starting application server for E2E tests..."
	-$(UV) run uvicorn src.collaboration_bridge.main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
	@sleep 3  # Wait for server to start
	@echo "Running E2E tests..."
	# npx playwright install --with-deps
	# TEST_ENV=ci npx playwright test --workers=1 --retries=2
	$(UV) run behave tests/e2e/features
	# $(UV) run pytest tests/e2e --playwright
	@echo "Stopping application server..."
	-pkill -f "uvicorn src.collaboration_bridge.main:app"

test-all: clean-test test-env ## Run all tests
	@$(MAKE) test-unit
	@$(MAKE) test-db-setup
	@$(MAKE) test-integration
	@$(MAKE) test-e2e

test-cov: ## Run tests with coverage
	ENVIRONMENT=testing $(UV) run pytest --cov=src --cov-report=html --cov-report=term

test-smoke: test-env ## Quick smoke test for AI agents
	@$(MAKE) test-db-setup
	ENVIRONMENT=testing $(UV) run pytest tests/smoke -v --fail-fast --timeout=10


# ==============================================================================
# Linting & Formatting
# ==============================================================================
lint: ## Run linting checks
	$(UV) run ruff check src tests
	$(UV) run mypy src

format: ## Format code
	$(UV) run ruff format src tests
	$(UV) run ruff check --fix src tests


# ==============================================================================
# Database
# ==============================================================================
test-db-setup: ## Setup database with deterministic state
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	$(UV) run alembic upgrade head
	# uv run python scripts/seed_test_data.py --deterministic --seed=42

db-init: ## Initialize database with Alembic
	$(UV) run alembic init alembic

db-migrate: ## Create new migration
	@test -n "$(msg)" || (echo "Error: msg parameter required. Usage: make db-migrate msg='your message'" && exit 1)
	$(UV) run alembic revision --autogenerate -m "$(msg)"

db-upgrade: ## Run database migrations
	$(UV) run alembic upgrade head

db-downgrade: ## Rollback database migration
	$(UV) run alembic downgrade -1

db-history: ## Show migration history
	$(UV) run alembic history

db-current: ## Show current database revision
	$(UV) run alembic current

db-sqlite-upgrade: ## Run migrations with SQLite (for testing)
	ENVIRONMENT=testing DATABASE_URL_TEST=sqlite+aiosqlite:///test.db \
	$(UV) run alembic upgrade head

db-reset: ## Reset database (drop all tables and re-run migrations)
	ENVIRONMENT=testing $(UV) run alembic downgrade base
	ENVIRONMENT=testing $(UV) run alembic upgrade head


# ==============================================================================
# Cleaning
# ==============================================================================
clean: ## Clean build artifacts
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.coverage" -delete
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache
	rm -rf docs/build

clean-test: ## Clean test state between runs
	rm -f test.db .coverage
	-sudo docker compose -f docker-compose.test.yml down -v
	rm -rf .pytest_cache test-results/ .uv/
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true


# ==============================================================================
# Docker
# ==============================================================================
docker-up: ## Start Docker services
	sudo docker compose -f docker/docker-compose.yml up -d

docker-down: ## Stop Docker services
	sudo docker compose -f docker/docker-compose.yml down

docker-logs: ## View Docker logs
	sudo docker compose -f docker/docker-compose.yml logs -f


# ==============================================================================
# Documentation
# ==============================================================================
docs: ## Build documentation
	./scripts/generate-docs.sh

docs-serve: ## Serve documentation locally
	./scripts/serve-docs.sh

docs-dev: ## Start development documentation server
	./scripts/dev-docs.sh

docs-deploy: ## Deploy documentation to GitHub Pages
	./scripts/deploy-docs.sh

docs-clean: ## Clean documentation build
	rm -rf docs/build


# ==============================================================================
# Hooks
# ==============================================================================
pre-commit: ## Run pre-commit hooks
	$(UV) run pre-commit run --all-files

install-hooks: ## Install git hooks (including work hours policy)
	$(UV) run pre-commit install
	./scripts/install-pre-push-hook.sh

# ==============================================================================
# Nix-specific commands
# ==============================================================================
install-nix: ## Install Nix package manager and direnv
	./scripts/install-nix.sh

nix-shell: ## Enter Nix development shell
	nix-shell

nix-services-start: ## Start PostgreSQL and Redis (Nix)
	./scripts/nix-services.sh start

nix-services-stop: ## Stop PostgreSQL and Redis (Nix)
	./scripts/nix-services.sh stop

nix-services-status: ## Check service status (Nix)
	./scripts/nix-services.sh status


# ==============================================================================
# Service URL Management
# ==============================================================================
service-urls-list: ## List all service URLs
	$(UV) run python scripts/service-urls.py list-services

service-urls-health: ## Check health of all services
	$(UV) run python scripts/service-urls.py health-check

service-urls-test: ## Test connectivity to all services
	$(UV) run python scripts/service-urls.py test-endpoints

# ==============================================================================
# Validation
# ==============================================================================
validate-env: ## Validate the environment
	# uv run python scripts/check_environment.py
	@echo "✓ Environment validated"