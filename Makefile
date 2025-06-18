.PHONY: help install dev test lint format docs clean docker-up docker-down

# Variables
PROJECT_NAME := project_name
PYTHON := python3.11
POETRY := poetry

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install project dependencies
	$(POETRY) install

dev: ## Run development server
	$(POETRY) run uvicorn src.$(PROJECT_NAME).main:app --reload --host 0.0.0.0 --port 8000

test: ## Run all tests
	$(POETRY) run pytest

test-unit: ## Run unit tests only
	$(POETRY) run pytest tests/unit

test-integration: ## Run integration tests only
	$(POETRY) run pytest tests/integration

test-e2e: ## Run end-to-end tests
	$(POETRY) run behave tests/e2e/features
	$(POETRY) run pytest tests/e2e --playwright

test-cov: ## Run tests with coverage
	$(POETRY) run pytest --cov=src --cov-report=html --cov-report=term

lint: ## Run linting checks
	$(POETRY) run ruff check src tests
	$(POETRY) run mypy src

format: ## Format code
	$(POETRY) run ruff format src tests
	$(POETRY) run ruff check --fix src tests

docs: ## Build documentation
	cd docs && $(POETRY) run make html

docs-serve: ## Serve documentation locally
	cd docs && $(POETRY) run python -m http.server -d build/html 8080

docs-dev: ## Start development documentation server
	./scripts/dev-docs.sh

docs-deploy: ## Deploy documentation to GitHub Pages
	./scripts/deploy-docs.sh

setup-github-pages: ## Setup GitHub Pages via API
	./scripts/setup-github-pages.sh

# Nix-specific commands
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

docker-up: ## Start Docker services
	docker-compose -f docker/docker-compose.yml up -d

docker-down: ## Stop Docker services
	docker-compose -f docker/docker-compose.yml down

docker-logs: ## View Docker logs
	docker-compose -f docker/docker-compose.yml logs -f

db-init: ## Initialize database with Alembic
	$(POETRY) run alembic init alembic

db-migrate: ## Create new migration
	@test -n "$(msg)" || (echo "Error: msg parameter required. Usage: make db-migrate msg='your message'" && exit 1)
	$(POETRY) run alembic revision --autogenerate -m "$(msg)"

db-upgrade: ## Run database migrations
	$(POETRY) run alembic upgrade head

db-downgrade: ## Rollback database migration
	$(POETRY) run alembic downgrade -1

db-history: ## Show migration history
	$(POETRY) run alembic history

db-current: ## Show current database revision
	$(POETRY) run alembic current

db-sqlite-upgrade: ## Run migrations with SQLite (for testing)
	DATABASE_BACKEND=sqlite $(POETRY) run alembic upgrade head

db-reset: ## Reset database (drop all tables and re-run migrations)
	$(POETRY) run alembic downgrade base
	$(POETRY) run alembic upgrade head

pre-commit: ## Run pre-commit hooks
	$(POETRY) run pre-commit run --all-files
