# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the Python MVP Template.

## Common Issues

### Installation Problems

#### Nix Installation Issues

**Problem**: `nix: command not found`
```bash
# Solution: Install Nix
curl -L https://nixos.org/nix/install | sh
# Or use the template script
make install-nix
```

**Problem**: `error: experimental Nix feature 'nix-command' is disabled`
```bash
# Solution: Enable flakes and nix-command
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

**Problem**: `direnv: command not found`
```bash
# Solution: Install direnv
# On macOS
brew install direnv

# On Ubuntu/Debian
sudo apt install direnv

# Add to shell profile
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
```

#### Poetry Installation Issues

**Problem**: `poetry: command not found`
```bash
# Solution: Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Add to PATH
export PATH="$HOME/.local/bin:$PATH"
```

**Problem**: `Poetry could not find a pyproject.toml file`
```bash
# Solution: Ensure you're in the project directory
cd /path/to/your/project
ls -la pyproject.toml  # Should exist
```

### Database Issues

#### Connection Problems

**Problem**: `connection to server at "localhost" (127.0.0.1), port 5432 failed`
```bash
# Check if PostgreSQL is running
# Nix environment
services_status

# Manual installation
sudo systemctl status postgresql
# or
brew services list | grep postgresql

# Start PostgreSQL
# Nix
services_start

# System service
sudo systemctl start postgresql
# or
brew services start postgresql
```

**Problem**: `FATAL: database "myapp" does not exist`
```bash
# Create database
# Nix environment (PostgreSQL should auto-create)
services_restart

# Manual
createdb myapp
# or
psql -c "CREATE DATABASE myapp;"
```

**Problem**: `FATAL: role "postgres" does not exist`
```bash
# Create postgres user
# Nix handles this automatically

# Manual
sudo -u postgres createuser --superuser $USER
# or
createuser --superuser postgres
```

#### Migration Issues

**Problem**: `Target database is not up to date`
```bash
# Check migration status
make db-current
make db-history

# Apply pending migrations
make db-upgrade

# If migrations are corrupted, reset (DEVELOPMENT ONLY)
make db-reset
```

**Problem**: `Can't locate revision identified by 'xyz'`
```bash
# Check alembic revision history
alembic history

# If revision is missing, you may need to:
# 1. Restore from backup
# 2. Manually fix alembic_version table
# 3. Reset database (development only)
```

### Application Startup Issues

#### Port Already in Use

**Problem**: `[Errno 48] Address already in use`
```bash
# Find process using port 8000
lsof -i :8000
# or
netstat -tulpn | grep :8000

# Kill the process
kill -9 <PID>

# Or use different port
uvicorn src.your_package.main:app --port 8001
```

#### Import Errors

**Problem**: `ModuleNotFoundError: No module named 'src'`
```bash
# Check Python path
echo $PYTHONPATH

# Ensure you're in the right environment
# Nix
nix develop

# Poetry
poetry shell

# Check if packages are installed
poetry show
```

**Problem**: `ImportError: cannot import name 'settings'`
```bash
# Check if .env file exists
ls -la .env

# Copy from example if missing
cp .env.example .env

# Edit with your configuration
vim .env
```

### Service URL Manager Issues

#### Configuration Problems

**Problem**: `FileNotFoundError: Configuration file not found`
```bash
# Check if config file exists
ls -la config/service-urls.json

# Create from template if missing
mkdir -p config
# Copy example configuration or create new one
```

**Problem**: `ValueError: Environment 'production' not found`
```bash
# Check available environments
python scripts/service-urls.py list-environments

# Check configuration file
cat config/service-urls.json | jq '.environments | keys'

# Add missing environment to config
```

**Problem**: `Service 'api' not found in environment`
```bash
# List services in current environment
python scripts/service-urls.py list-services

# Check service configuration
python scripts/service-urls.py env-info
```

### Testing Issues

#### Test Database Problems

**Problem**: `Tests fail with database connection errors`
```bash
# Ensure test database exists
createdb myapp_test

# Check test database URL in .env
grep TEST_DATABASE_URL .env

# Run tests with verbose output
make test -v
```

**Problem**: `Tests pass individually but fail when run together`
```bash
# This usually indicates test isolation issues
# Check if tests are cleaning up properly

# Run tests in random order to identify dependencies
poetry run pytest --random-order

# Use database transactions in tests
# Check conftest.py for proper session handling
```

#### Import Issues in Tests

**Problem**: `ModuleNotFoundError in tests`
```bash
# Check if __init__.py files exist
find tests/ -name "__init__.py"

# Ensure proper test structure
# tests/
# ├── __init__.py
# ├── conftest.py
# └── unit/
#     └── __init__.py
```

### Performance Issues

#### Slow Database Queries

**Problem**: Application responds slowly
```bash
# Enable SQL query logging
# In .env file
DEBUG=true

# Check logs for slow queries
tail -f logs/app.log | grep "slow_query"

# Use database query analysis
# PostgreSQL
EXPLAIN ANALYZE SELECT ...;
```

**Problem**: High memory usage
```bash
# Check memory usage
htop
# or
ps aux | grep python

# Profile memory usage
poetry run python -m memory_profiler your_script.py
```

#### Connection Pool Issues

**Problem**: `QueuePool limit of size 5 overflow 10 reached`
```bash
# Increase connection pool size in database configuration
# src/your_package/core/database.py
engine = create_async_engine(
    database_url,
    pool_size=20,      # Increase from default
    max_overflow=30,   # Increase overflow
)
```

### Docker Issues

#### Build Problems

**Problem**: `Docker build fails`
```bash
# Check Docker is running
docker info

# Build with verbose output
docker build -f docker/Dockerfile -t myapp:latest . --progress=plain

# Check for common issues:
# - Missing files in .dockerignore
# - Incorrect COPY paths
# - Network issues during pip install
```

**Problem**: `Container exits immediately`
```bash
# Check container logs
docker logs <container_id>

# Run container interactively
docker run -it myapp:latest /bin/bash

# Check if all environment variables are set
docker run --env-file .env myapp:latest
```

### Development Environment Issues

#### Code Quality Tools

**Problem**: `Pre-commit hooks fail`
```bash
# Install pre-commit hooks
poetry run pre-commit install

# Run hooks manually
make pre-commit

# Skip hooks temporarily (not recommended)
git commit --no-verify
```

**Problem**: `Ruff/Black formatting conflicts`
```bash
# Run formatters in correct order
make format

# Check configuration in pyproject.toml
# Ensure ruff and black configurations are compatible
```

#### IDE Issues

**Problem**: `VS Code doesn't recognize imports`
```bash
# Select correct Python interpreter
# Cmd/Ctrl + Shift + P -> "Python: Select Interpreter"
# Choose the poetry/nix environment Python

# Check if .vscode/settings.json exists with correct paths
```

**Problem**: `Type checking errors in IDE`
```bash
# Ensure mypy is installed
poetry show mypy

# Check mypy configuration in pyproject.toml
# Run mypy manually
poetry run mypy src/
```

## Debugging Techniques

### Application Debugging

#### Using Python Debugger

```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use modern breakpoint() (Python 3.7+)
breakpoint()

# For async code
import asyncio
import pdb

async def debug_async():
    pdb.set_trace()
    # Your async code here
```

#### Logging for Debugging

```python
import structlog

logger = structlog.get_logger(__name__)

# Add debug logging
logger.debug("Variable value", variable=my_variable)
logger.info("Function called", function="my_function", args=args)

# Log request/response data
logger.debug("API request", method=request.method, path=request.url.path)
```

### Database Debugging

#### SQL Query Debugging

```python
# Enable SQL logging in development
# src/your_package/core/database.py
engine = create_async_engine(
    database_url,
    echo=True,  # This will log all SQL queries
)
```

#### Manual Database Inspection

```bash
# Connect to database
psql -d myapp

# List tables
\dt

# Describe table structure
\d users

# Check data
SELECT * FROM users LIMIT 5;

# Check migrations
SELECT * FROM alembic_version;
```

### API Debugging

#### Using curl for API Testing

```bash
# Test health endpoint
curl http://localhost:8000/api/v1/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/v1/profile

# Test POST request
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}' \
     http://localhost:8000/api/v1/auth/login
```

#### Using httpie (Alternative to curl)

```bash
# Install httpie
pip install httpie

# Test endpoints
http GET localhost:8000/api/v1/health
http POST localhost:8000/api/v1/auth/login email=test@example.com password=test123
```

## Performance Debugging

### Profiling

#### Using cProfile

```bash
# Profile your application
python -m cProfile -o profile.stats -m uvicorn src.your_package.main:app

# Analyze profile
python -c "
import pstats
p = pstats.Stats('profile.stats')
p.sort_stats('cumulative').print_stats(20)
"
```

#### Memory Profiling

```bash
# Install memory profiler
pip install memory-profiler

# Profile memory usage
python -m memory_profiler your_script.py
```

### Database Performance

#### Query Analysis

```sql
-- PostgreSQL query analysis
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Getting Help

### Log Analysis

```bash
# View application logs
tail -f logs/app.log

# Search for errors
grep -i error logs/app.log

# Filter by log level
grep '"level":"ERROR"' logs/app.log | jq .

# Follow logs in real-time with filtering
tail -f logs/app.log | grep -i "database"
```

### System Information

```bash
# Check system resources
htop
df -h
free -h

# Check Python environment
python --version
poetry --version
which python

# Check environment variables
env | grep -E "(DATABASE|REDIS|SECRET)"
```

### Health Checks

```bash
# Check all services
make service-urls-health

# Test connectivity
make service-urls-test

# Check individual service
curl http://localhost:8000/api/v1/health/detailed
```

## When to Seek Help

### Create Detailed Bug Reports

When reporting issues, include:

1. **Environment information**:
   - OS and version
   - Python version
   - Poetry/Nix version
   - Template version/commit

2. **Steps to reproduce**:
   - Exact commands run
   - Configuration used
   - Expected vs actual behavior

3. **Error messages**:
   - Full error traceback
   - Relevant log entries
   - Screenshots if applicable

4. **Context**:
   - What you were trying to achieve
   - Recent changes made
   - Working configurations

### Useful Commands for Bug Reports

```bash
# System information
uname -a
python --version
poetry --version

# Project information
git log --oneline -5
git status
ls -la

# Configuration (remove sensitive data)
cat .env.example
head -20 pyproject.toml

# Service status
make service-urls-health
services_status  # If using Nix
```

Remember: Most issues have been encountered before. Check the documentation, search existing issues, and don't hesitate to ask for help! 🚑
