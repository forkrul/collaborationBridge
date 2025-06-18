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

- Python 3.11+
- Poetry
- Docker & Docker Compose (optional)

### Installation

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
