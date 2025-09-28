# Complete Test Environment Setup for AI Agents

## Quick Start
```bash
# One-time setup
make test-env

# Run all tests
make test-all

# Quick unit tests only
make test-unit
```

## Adding New Features
1. Create tests first: `tests/test_<feature>.py`
2. Use existing factories: `from tests.factories import UserFactory`
3. Run tests: `uv run pytest tests/test_<feature>.py -v`

## Database Testing
- Unit tests use SQLite (fast, no setup)
- Integration tests use PostgreSQL (production-like)
- Both use same models via SQLAlchemy

## Debugging Failed Tests
```bash
# Run single test with output
uv run pytest tests/test_file.py::test_name -vvs

# Check test database state
TEST_DB=sqlite:///test.db uv run python
>>> from src.collaboration_bridge.models import *
>>> # inspect data
```

## CI/CD Integration
GitHub Actions automatically runs:
1. `make validate-env` - Check environment
2. `make test-all` - Full test suite
3. Reports coverage and test results

## Troubleshooting
- If tests fail, run: `make clean-test && make test-env`