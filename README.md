# Python MVP Template

A modern Python MVP template built with FastAPI, SQLAlchemy, and best practices for rapid development.

## Features

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy 2.0**: Powerful ORM with async support
- **Pydantic**: Data validation using Python type annotations
- **Alembic**: Database migration tool
- **Pytest**: Testing framework with async support
- **Docker**: Containerization for development and production
- **Pre-commit**: Code quality hooks
- **Structured Logging**: JSON logging with structlog
- **Security**: JWT authentication and password hashing
- **Soft Delete**: Built-in soft delete functionality for all models
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Documentation**: Auto-generated API docs with Sphinx

## Quick Start

### Prerequisites

**Option 1: Nix (Recommended)**
- [Nix package manager](https://nixos.org/download.html)
- [direnv](https://direnv.net/) (optional but recommended)

**Option 2: Manual Setup**
- Python 3.11+
- Poetry
- PostgreSQL 16+
- Redis
- Docker & Docker Compose (optional)

### Installation

#### Using Nix (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-template
   ```

2. **Enter Nix development environment**
   ```bash
   # With Nix flakes
   nix develop

   # Or with traditional nix-shell
   nix-shell

   # Or with direnv (automatic)
   direnv allow
   ```

3. **Install Python dependencies**
   ```bash
   make install
   ```

4. **Start services and run migrations**
   ```bash
   services_start  # Start PostgreSQL and Redis
   make db-upgrade
   ```

5. **Start the development server**
   ```bash
   make dev
   ```

#### Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-template
   ```

2. **Install dependencies**
   ```bash
   make install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   make db-upgrade
   ```

5. **Start the development server**
   ```bash
   make dev
   ```

6. **Visit the API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Nix Development Environment

This project includes comprehensive Nix support for reproducible development environments:

### Nix Quick Start

```bash
# Clone project
git clone <repository-url>
cd mvp-template

# Install Nix and direnv (one-time setup)
make install-nix

# Enter development environment
nix develop  # or nix-shell

# Install dependencies and start services
make install
services_start
make dev
```

**Alternative manual Nix installation:**
```bash
# Install Nix manually
sh <(curl -L https://nixos.org/nix/install) --daemon
```

### Nix Features

- **🔒 Reproducible**: Exact same environment for all developers
- **🚀 Fast Setup**: One command gets everything working
- **🗄️ Integrated Services**: PostgreSQL and Redis included
- **🛠️ Complete Toolchain**: Python, databases, docs, testing tools
- **🔄 Automatic**: Works with direnv for seamless development

### Nix Commands

```bash
# Service management (in nix-shell)
services_start     # Start PostgreSQL and Redis
services_stop      # Stop all services
services_status    # Check service status

# Or via scripts
make nix-services-start
make nix-services-stop
make nix-services-status
```

## Development

### Using Make Commands

```bash
# Install dependencies
make install

# Run development server
make dev

# Run tests
make test
make test-unit
make test-integration
make test-e2e

# Run linting and formatting
make lint
make format

# Database operations
make db-migrate msg="Add new table"
make db-upgrade
make db-downgrade

# Documentation
make docs
make docs-serve

# Docker operations
make docker-up
make docker-down
```

### Using Docker

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

## Project Structure

```
project-name/
├── .github/workflows/          # GitHub Actions CI/CD
├── src/project_name/           # Main application code
│   ├── api/                    # API routes and endpoints
│   ├── core/                   # Core configuration and utilities
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic
│   └── utils/                  # Utility functions
├── tests/                      # Test suite
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── docs/                       # Documentation
├── docker/                     # Docker configuration
├── alembic/                    # Database migrations
└── scripts/                    # Utility scripts
```

## Testing

The template includes comprehensive testing setup:

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows with BDD

```bash
# Run all tests
make test

# Run with coverage
make test-cov

# Run specific test types
make test-unit
make test-integration
make test-e2e
```

## Database

### Migrations

```bash
# Create a new migration
make db-migrate msg="Add user table"

# Apply migrations
make db-upgrade

# Rollback migration
make db-downgrade
```

### Models

All models inherit from `BaseModel` which provides:
- Automatic timestamps (`created_at`, `updated_at`)
- Soft delete functionality (`deleted_at`, `is_deleted`)
- Standard primary key (`id`)

## API Documentation

The API documentation is automatically generated and available at:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation with Pydantic

## Documentation

The project includes comprehensive documentation built with Sphinx:

- **Local Documentation**: `make docs` then `make docs-serve`
- **GitHub Pages**: Deploy with `make docs-deploy`
- **Live Documentation**: https://forkrul.github.io/project-template-mvp/

### Documentation Workflow

```bash
# 1. Setup GitHub Pages (one-time)
make setup-github-pages

# 2. Build documentation locally
make docs

# 3. Preview documentation
make docs-serve

# 4. Deploy to GitHub Pages
make docs-deploy
```

### GitHub Pages API Management

GitHub Pages can be configured programmatically:

```bash
# Enable GitHub Pages via script
./scripts/setup-github-pages.sh

# Or manually via API
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/pages \
  -d '{"source": {"branch": "gh-pages", "path": "/"}}'
```

## Deployment

### Production Docker

```bash
# Build production image
docker build -f docker/Dockerfile -t project-name:latest .

# Run production container
docker run -p 8000:8000 project-name:latest
```

### Environment Variables

Key environment variables (see `.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: Application secret key
- `JWT_SECRET_KEY`: JWT signing key
- `ENVIRONMENT`: Environment (development/testing/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
