.PHONY: test-env test-unit test-integration test-e2e test-all clean-test

# Environment setup with uv
test-env:
	uv sync --all-extras
	npm ci
	sudo docker compose -f docker-compose.test.yml up -d --wait

# Database setup with deterministic state (for PostgreSQL)
test-db-setup:
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	uv run alembic upgrade head
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	uv run python scripts/seed_test_data.py --deterministic --seed=42

# Test execution with proper isolation
test-unit:
	# Ensure the sqlite db file is clean and migrations are run
	rm -f test.db
	ENVIRONMENT=testing DATABASE_URL_TEST=sqlite+aiosqlite:///./test.db \
	uv run alembic upgrade head
	# Run unit tests
	ENVIRONMENT=testing DATABASE_URL_TEST=sqlite+aiosqlite:///./test.db \
	uv run pytest tests/unit -v --tb=short

test-integration:
	ENVIRONMENT=testing DATABASE_URL_TEST=postgresql+asyncpg://test:test@localhost:5432/test_db \
	uv run pytest tests/integration -v --tb=short

test-e2e:
	npx playwright install --with-deps
	TEST_ENV=ci npx playwright test --workers=1 --retries=2

test-all: clean-test test-env
	@$(MAKE) test-unit
	@$(MAKE) test-db-setup
	@$(MAKE) test-integration
	@$(MAKE) test-e2e

# Clean state between runs
clean-test:
	rm -f test.db .coverage
	-sudo docker compose -f docker-compose.test.yml down -v
	rm -rf .pytest_cache test-results/ .uv/
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Validation
validate-env:
	uv run python scripts/check_environment.py
	@echo "✓ Environment validated"

# Quick smoke test for AI agents
test-smoke: test-env
	@$(MAKE) test-db-setup
	uv run pytest tests/smoke -v --fail-fast --timeout=10