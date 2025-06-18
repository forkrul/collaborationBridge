# Nix Development Environment

This project includes comprehensive Nix support for reproducible development environments. Nix ensures that all developers have exactly the same tools and dependencies, regardless of their host system.

## Quick Start with Nix

### Prerequisites

1. **Install Nix**: https://nixos.org/download.html
   ```bash
   # Multi-user installation (recommended)
   sh <(curl -L https://nixos.org/nix/install) --daemon
   ```

2. **Enable Flakes** (optional but recommended):
   ```bash
   mkdir -p ~/.config/nix
   echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
   ```

3. **Install direnv** (optional but recommended):
   ```bash
   # On NixOS
   nix-env -iA nixpkgs.direnv
   
   # On other systems
   curl -sfL https://direnv.net/install.sh | bash
   ```

### Using the Development Environment

#### Option 1: Nix Flakes (Recommended)

```bash
# Enter development shell
nix develop

# Or run commands directly
nix develop -c make dev
```

#### Option 2: Traditional Nix Shell

```bash
# Enter development shell
nix-shell

# Or run commands directly
nix-shell --run "make dev"
```

#### Option 3: Automatic with direnv

```bash
# Allow direnv for this project
direnv allow

# Environment will be loaded automatically when you cd into the project
cd /path/to/project  # Environment loads automatically
```

## What's Included

The Nix environment provides:

### Python Environment
- **Python 3.11** with all project dependencies
- **Poetry** for dependency management
- **FastAPI, SQLAlchemy, Pydantic** and all core dependencies
- **Development tools**: ruff, black, mypy, pre-commit
- **Testing tools**: pytest, factory-boy, faker
- **Documentation tools**: sphinx, myst-parser

### Database Services
- **PostgreSQL 16** for primary database
- **Redis** for caching and sessions
- **SQLite** for testing and development

### Development Tools
- **Git** for version control
- **Docker & Docker Compose** for containerization
- **curl, wget, jq** for API testing
- **Node.js** for documentation tools
- **Pandoc, Graphviz** for documentation generation

### System Dependencies
- **GCC, pkg-config** for compiling Python packages
- **OpenSSL, libffi, zlib** for cryptographic libraries
- **All necessary build tools**

## Service Management

The Nix environment includes convenient functions for managing development services:

### Automatic Functions (in nix-shell)

```bash
# Start all services
services_start

# Stop all services
services_stop

# Check service status
services_status

# Individual service control
pg_start      # Start PostgreSQL
pg_stop       # Stop PostgreSQL
redis_start   # Start Redis
redis_stop    # Stop Redis
```

### Script-based Management

```bash
# Using the nix-services script
./scripts/nix-services.sh start    # Start all services
./scripts/nix-services.sh stop     # Stop all services
./scripts/nix-services.sh status   # Check status
./scripts/nix-services.sh restart  # Restart all services

# Or via Make
make nix-services-start
make nix-services-stop
make nix-services-status
```

## Configuration Files

### shell.nix
Traditional Nix shell configuration with:
- Complete Python environment
- Database services setup
- Automatic service initialization
- Convenient shell functions
- Environment variables

### flake.nix
Modern Nix flakes configuration providing:
- Reproducible development environment
- Package definitions
- Docker image generation
- Cross-platform support

### .envrc
Direnv configuration for:
- Automatic environment loading
- Integration with both flakes and shell.nix
- Environment variable management
- Path configuration

## Database Setup

The Nix environment automatically sets up local databases:

### PostgreSQL
- **Data Directory**: `.nix-postgres/`
- **Log File**: `.nix-postgres.log`
- **Databases**: `project_dev`, `project_test`
- **Connection**: `postgresql://localhost:5432/project_dev`

### Redis
- **Config File**: `.nix-redis.conf`
- **Data Directory**: `.nix-redis-data/`
- **Log File**: `.nix-redis.log`
- **Connection**: `redis://localhost:6379/0`

## Environment Variables

The Nix shell automatically sets:

```bash
PYTHONPATH="./src"
DATABASE_URL="postgresql://localhost:5432/project_dev"
TEST_DATABASE_URL="postgresql://localhost:5432/project_test"
REDIS_URL="redis://localhost:6379/0"
POETRY_VENV_IN_PROJECT="1"
```

## Development Workflow

### First Time Setup

```bash
# 1. Enter Nix shell
nix develop  # or nix-shell

# 2. Install Python dependencies
make install

# 3. Start services
services_start

# 4. Run migrations
make db-upgrade

# 5. Start development server
make dev
```

### Daily Development

```bash
# With direnv (automatic)
cd project-directory  # Environment loads automatically
make dev

# Without direnv
nix develop -c make dev
```

### Testing

```bash
# In Nix shell
make test

# Or directly
nix develop -c make test
```

## Advantages of Nix

### Reproducibility
- **Exact Dependencies**: Everyone gets the same versions
- **System Independence**: Works on Linux, macOS, WSL
- **No Conflicts**: Isolated from system packages

### Convenience
- **One Command Setup**: `nix develop` gets everything
- **Automatic Services**: Databases start automatically
- **Clean Environment**: No leftover packages

### Reliability
- **Atomic Updates**: All-or-nothing dependency updates
- **Rollback Support**: Easy to revert changes
- **Binary Cache**: Fast installation from cache

## Troubleshooting

### Common Issues

#### Nix Not Found
```bash
# Make sure Nix is in PATH
echo $PATH | grep nix

# Restart shell after installation
exec $SHELL
```

#### Services Won't Start
```bash
# Check if ports are in use
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Clean and reinitialize
./scripts/nix-services.sh stop
rm -rf .nix-postgres .nix-redis-data .nix-redis.conf
./scripts/nix-services.sh init
```

#### Permission Issues
```bash
# Fix PostgreSQL permissions
chmod 700 .nix-postgres
```

### Getting Help

```bash
# Show available functions
nix-shell --run "declare -F"

# Service management help
./scripts/nix-services.sh help

# Make targets
make help
```

## Integration with Other Tools

### VS Code
Add to `.vscode/settings.json`:
```json
{
    "python.defaultInterpreterPath": "./.venv/bin/python",
    "python.terminal.activateEnvironment": false
}
```

### PyCharm
1. Go to Settings → Project → Python Interpreter
2. Add interpreter from `.venv/bin/python`
3. Set environment variables from `.envrc`

### Docker
The Nix environment works alongside Docker:
```bash
# Use Nix for development
nix develop -c make dev

# Use Docker for production testing
make docker-up
```
