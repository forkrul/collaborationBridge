# Quick Start Guide

This guide will get you up and running with the Python MVP Template in minutes.

## Prerequisites

Choose your preferred setup method:

### Option 1: Nix (Recommended)
- [Nix package manager](https://nixos.org/download.html)
- [direnv](https://direnv.net/) (optional but recommended)

### Option 2: Manual Setup
- Python 3.11+
- Poetry
- PostgreSQL 16+
- Redis
- Docker (optional)

## Installation Methods

### 🚀 Nix Setup (Recommended)

The fastest way to get started with a completely reproducible environment:

```bash
# 1. Clone your project
git clone https://github.com/yourusername/your-project.git
cd your-project

# 2. Install Nix (if not already installed)
make install-nix

# 3. Enter development environment
nix develop  # or nix-shell

# 4. Install Python dependencies
make install

# 5. Start services
services_start

# 6. Run database migrations
make db-upgrade

# 7. Start development server
make dev
```

**That's it!** Your application is now running at http://localhost:8000

### 🔧 Manual Setup

If you prefer to manage dependencies manually:

```bash
# 1. Clone your project
git clone https://github.com/yourusername/your-project.git
cd your-project

# 2. Install Poetry (if not installed)
curl -sSL https://install.python-poetry.org | python3 -

# 3. Install dependencies
make install

# 4. Set up environment
cp .env.example .env
# Edit .env with your database and Redis settings

# 5. Start PostgreSQL and Redis
# (Method depends on your system)

# 6. Run database migrations
make db-upgrade

# 7. Start development server
make dev
```

## First Steps

### 1. Explore the API

Once your server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health

### 2. Test the Default Endpoints

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Service discovery
curl http://localhost:8000/api/v1/services
```

### 3. Run the Test Suite

```bash
# Run all tests
make test

# Run with coverage
make test-cov

# Run specific test types
make test-unit
make test-integration
```

### 4. Check Code Quality

```bash
# Run linting
make lint

# Format code
make format

# Run pre-commit hooks
make pre-commit
```

## Project Structure Overview

```
your-project/
├── 📁 src/your_package/        # Main application code
│   ├── 📁 api/                 # FastAPI routes and endpoints
│   │   ├── 📁 v1/              # API version 1
│   │   │   ├── router.py       # Main API router
│   │   │   ├── dependencies.py # Dependency injection
│   │   │   └── endpoints/      # Individual endpoint modules
│   │   └── middleware/         # Custom middleware
│   ├── 📁 core/                # Core configuration
│   │   ├── config.py           # Settings and configuration
│   │   ├── database.py         # Database connection
│   │   └── security.py         # Authentication utilities
│   ├── 📁 models/              # SQLAlchemy models
│   │   ├── base.py             # Base model with soft delete
│   │   ├── mixins.py           # Reusable model mixins
│   │   └── user.py             # Example User model
│   ├── 📁 schemas/             # Pydantic schemas
│   │   ├── base.py             # Base schemas
│   │   └── user.py             # Example User schemas
│   ├── 📁 services/            # Business logic
│   ├── 📁 utils/               # Utility functions
│   │   └── service_url_manager.py # URL management
│   └── main.py                 # FastAPI application
├── 📁 tests/                   # Test suite
│   ├── 📁 unit/                # Unit tests
│   ├── 📁 integration/         # Integration tests
│   └── 📁 e2e/                 # End-to-end tests
├── 📁 config/                  # Configuration files
│   └── service-urls.json       # Service URL configuration
├── 📁 docker/                  # Docker configurations
├── 📁 scripts/                 # Utility scripts
├── 📁 docs/                    # Documentation
├── shell.nix                   # Nix development environment
├── flake.nix                   # Modern Nix flakes
├── pyproject.toml              # Python project configuration
└── Makefile                    # Development commands
```

## Essential Commands

### Development

```bash
make dev          # Start development server
make install      # Install dependencies
make clean        # Clean build artifacts
```

### Database

```bash
make db-upgrade   # Run migrations
make db-migrate   # Create new migration
make db-downgrade # Rollback migration
make db-reset     # Reset database
```

### Testing

```bash
make test         # Run all tests
make test-unit    # Unit tests only
make test-cov     # Tests with coverage
```

### Code Quality

```bash
make lint         # Run linting
make format       # Format code
make pre-commit   # Run pre-commit hooks
```

### Documentation

```bash
make docs         # Build documentation
make docs-serve   # Serve docs locally
make docs-deploy  # Deploy to GitHub Pages
```

### Services (Nix)

```bash
services_start    # Start PostgreSQL & Redis
services_stop     # Stop services
services_status   # Check service status
```

### Service URLs

```bash
make service-urls-list   # List all service URLs
make service-urls-health # Check service health
make service-urls-test   # Test connectivity
```

## Configuration

### Environment Variables

The template uses environment-based configuration. Key variables:

```bash
# Application
PROJECT_NAME=your-project
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379/0

# Security
JWT_SECRET_KEY=your-jwt-secret
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Service URLs

Configure service URLs in `config/service-urls.json`:

```json
{
  "environments": {
    "development": {
      "domain": "localhost",
      "protocol": "http",
      "services": {
        "api": {
          "port": 8000,
          "health_endpoint": "/api/v1/health"
        }
      }
    }
  }
}
```

## Next Steps

1. **Customize the Template**: Follow the [customization guide](../development/customization.md)
2. **Add Your Models**: Create your database models in `src/your_package/models/`
3. **Build Your API**: Add endpoints in `src/your_package/api/v1/endpoints/`
4. **Write Tests**: Add tests in the `tests/` directory
5. **Deploy**: Use the [deployment guide](../deployment/index.md)

## Getting Help

- **Documentation**: Browse the complete documentation
- **Examples**: Check the example models and schemas
- **Issues**: Report issues on GitHub
- **Community**: Join discussions and get help

## Common Issues

### Port Already in Use

```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL status (Nix)
services_status

# Restart services
services_stop
services_start
```

### Import Errors

```bash
# Ensure you're in the right environment
which python
echo $PYTHONPATH

# Reinstall dependencies
make clean
make install
```

Ready to build something amazing? Let's go! 🚀
