# Agent Testing Guide

## Prerequisites
- uv >= 0.4.0
- Node >= 20.0.0
- PostgreSQL >= 14 (for integration tests)

## Quick Start & Environment Setup
```bash
# One-time setup for all dependencies
make test-env

# Run the full test suite
make test-all

# Run only the fast unit tests
make test-unit
```

## Adding New Features
1.  Create your test file first (e.g., `tests/unit/test_new_feature.py`).
2.  Use existing factories for test data: `from tests.factories import UserFactory`.
3.  Run your new test specifically: `uv run pytest tests/unit/test_new_feature.py -v`.

## Database Testing
-   Unit tests use an in-memory SQLite database for speed (`make test-unit`).
-   Integration tests use a real PostgreSQL database via Docker for production parity (`make test-integration`).
-   The same data models are used for both, thanks to SQLAlchemy.

## Debugging Failed Tests
```bash
# Run a single test with verbose output
uv run pytest tests/test_file.py::test_name -vvs

# Inspect the SQLite database state after a run
TEST_DB=sqlite:///test.db uv run python
>>> from src.collaboration_bridge.models import *
>>> # Now you can query your models, e.g., session.query(User).all()
```

## CI/CD Integration
GitHub Actions automatically performs the following checks on every push:
1.  `make validate-env` - Validates the environment configuration.
2.  `make test-all` - Runs the complete test suite.
3.  Reports test coverage and results.

## Troubleshooting
-   If tests are failing unexpectedly, clean the environment and rebuild it:
    ```bash
    make clean-test && make test-env
    ```