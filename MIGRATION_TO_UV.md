# Migration to Astral's uv

This project has been migrated from Poetry to Astral's uv for faster dependency management and improved developer experience.

## What Changed

### Package Management
- **Before**: Poetry (`poetry install`, `poetry run`)
- **After**: uv (`uv sync`, `uv run`)

### Configuration
- **Before**: `pyproject.toml` with Poetry configuration + separate `requirements/*.txt` files
- **After**: `pyproject.toml` with standard Python packaging + `uv.lock` for dependency resolution

### Tooling Consolidation
- **Removed**: Black, isort (redundant with Ruff)
- **Kept**: Ruff (handles linting + formatting), MyPy (type checking)
- **Updated**: Ruff to latest version with improved configuration

## New Commands

### Installation
```bash
# Install all dependencies
make install

# Install with dev/test/docs dependencies
make install-dev
```

### Development
```bash
# Run development server
make dev

# Run tests
make test

# Lint and format
make lint
make format
```

### Direct uv usage
```bash
# Sync dependencies
uv sync

# Install with extras
uv sync --extra dev --extra test --extra docs

# Run commands
uv run pytest
uv run ruff check src tests
uv run mypy src
```

## Benefits

1. **Faster**: uv is significantly faster than Poetry for dependency resolution and installation
2. **Simpler**: Standard Python packaging without Poetry-specific configuration
3. **Better caching**: Improved dependency caching and resolution
4. **Consolidated tooling**: Ruff handles both linting and formatting
5. **Modern**: Uses latest Python packaging standards

## Migration Notes

- All existing functionality is preserved
- Docker images updated to use uv
- CI/CD workflows updated
- All scripts and documentation updated
- Lock file format changed from `poetry.lock` to `uv.lock`

## Troubleshooting

If you encounter issues:

1. **Clear old virtual environment**: `rm -rf .venv`
2. **Reinstall dependencies**: `uv sync --extra dev --extra test --extra docs`
3. **Update pre-commit hooks**: `uv run pre-commit install`

For more information about uv, see: https://docs.astral.sh/uv/
