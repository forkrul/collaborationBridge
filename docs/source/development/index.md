# Development Guide

This guide covers everything you need to know for developing with the Python MVP Template.

## Development Environment

### Nix Environment (Recommended)

The template includes a complete Nix development environment that provides:

- **Python 3.11** with all dependencies
- **PostgreSQL 16** and **Redis** services
- **Development tools**: git, docker, curl, jq
- **Documentation tools**: sphinx, pandoc, graphviz
- **System dependencies**: gcc, openssl, libffi

```bash
# Enter development environment
nix develop  # or nix-shell

# With direnv (automatic)
direnv allow
cd your-project  # Environment loads automatically
```

### Manual Environment

If not using Nix, ensure you have:

```bash
# Python and uv
python3.11 --version
uv --version

# Database services
postgresql --version
redis-server --version

# Development tools
docker --version
git --version
```

## Project Configuration

### Environment Files

The template uses environment-based configuration:

```bash
# Copy example configuration
cp .env.example .env

# Edit with your settings
vim .env
```

**Key Configuration Sections:**

```bash
# Application Settings
PROJECT_NAME=your-project
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/your_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External Services
SENTRY_DSN=https://your-sentry-dsn
```

### Service URL Configuration

Configure service URLs in `config/service-urls.json`:

```json
{
  "environments": {
    "development": {
      "domain": "localhost",
      "protocol": "http",
      "services": {
        "api": {
          "subdomain": null,
          "port": 8000,
          "path": "",
          "health_endpoint": "/api/v1/health"
        },
        "frontend": {
          "subdomain": null,
          "port": 3000,
          "path": "",
          "health_endpoint": "/health"
        }
      }
    }
  },
  "api_endpoints": {
    "users": {
      "list": "/api/v1/users",
      "detail": "/api/v1/users/{user_id}"
    }
  }
}
```

## 📁 Project Structure

```
project-template-mvp/
├── 📁 alembic/                 # Database migrations
├── 📁 config/                  # Configuration files
├── 📁 docker/                  # Docker configuration
├── 📁 docs/                    # Sphinx documentation
│   └── 📁 source/
│       ├── 📁 i18n/           # Internationalization docs
│       └── ...
├── 📁 frontend/                # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   └── 📁 [locale]/   # Locale-based routing
│   │   ├── 📁 components/
│   │   │   └── 📁 i18n/       # i18n components
│   │   ├── 📁 i18n/           # Frontend i18n configuration
│   │   │   ├── 📁 locales/    # Translation files
│   │   │   └── 📄 config.ts   # i18n configuration
│   │   └── 📄 middleware.ts   # Next.js i18n middleware
│   └── ...
├── 📁 requirements/            # Python dependencies
├── 📁 scripts/                 # Utility scripts
├── 📁 src/                     # Python source code
│   └── 📁 project_name/
│       ├── 📁 api/v1/endpoints/
│       │   └── 📄 i18n.py     # i18n API endpoints
│       ├── 📁 i18n/           # Backend i18n system
│       │   ├── 📁 locales/    # Backend translation files
│       │   ├── 📄 config.py   # i18n configuration
│       │   └── 📄 manager.py  # Translation manager
│       └── ...
├── 📁 tests/                   # Test files
│   ├── 📁 unit/
│   │   └── 📄 test_i18n_manager.py
│   └── ...
├── 📄 .env.example            # Environment variables template
├── 📄 .gitignore              # Git ignore rules
├── 📄 alembic.ini             # Alembic configuration
├── 📄 Makefile                # Build automation
├── 📄 pyproject.toml          # Python project configuration
├── 📄 README.md               # Project documentation
└── 📄 shell.nix               # Nix development environment
```

## Development Workflow

### Daily Development

```bash
# 1. Start development environment
nix develop  # or activate your environment

# 2. Start services (Nix)
services_start

# 3. Start development server
make dev

# 4. In another terminal, run tests
make test

# 5. Check code quality
make lint
```

### Adding New Features

1. **Create a branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Add your code**:
   - Models in `src/your_package/models/`
   - Schemas in `src/your_package/schemas/`
   - Endpoints in `src/your_package/api/v1/endpoints/`
   - Business logic in `src/your_package/services/`

3. **Write tests**:
   ```bash
   # Add tests in tests/
   make test
   ```

4. **Check quality**:
   ```bash
   make lint
   make format
   ```

5. **Create migration** (if needed):
   ```bash
   make db-migrate msg="Add new feature"
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

## Code Organization

### Models (SQLAlchemy)

Create models in `src/your_package/models/`:

```python
# src/your_package/models/post.py
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from .base import BaseModel
from .mixins import TitleMixin, DescriptionMixin

class Post(BaseModel, TitleMixin, DescriptionMixin):
    """Blog post model."""
    
    __tablename__ = "posts"
    
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="posts")
```

### Schemas (Pydantic)

Create schemas in `src/your_package/schemas/`:

```python
# src/your_package/schemas/post.py
from typing import Optional
from pydantic import Field

from .base import BaseSchema, TimestampSchema

class PostBase(BaseSchema):
    """Base post schema."""
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)

class PostCreate(PostBase):
    """Schema for creating posts."""
    pass

class PostUpdate(BaseSchema):
    """Schema for updating posts."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)

class PostResponse(PostBase, TimestampSchema):
    """Schema for post responses."""
    id: int
    author_id: int
```

### API Endpoints

Create endpoints in `src/your_package/api/v1/endpoints/`:

```python
# src/your_package/api/v1/endpoints/posts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.your_package.core.database import get_db
from src.your_package.schemas.post import PostCreate, PostResponse
from src.your_package.services.post_service import PostService

router = APIRouter()

@router.post("/", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new post."""
    service = PostService(db)
    return await service.create_post(post_data)

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a post by ID."""
    service = PostService(db)
    post = await service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
```

### Services (Business Logic)

Create services in `src/your_package/services/`:

```python
# src/your_package/services/post_service.py
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.your_package.models.post import Post
from src.your_package.schemas.post import PostCreate, PostUpdate

class PostService:
    """Service for post operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_post(self, post_data: PostCreate) -> Post:
        """Create a new post."""
        post = Post(**post_data.model_dump())
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        return post
    
    async def get_post(self, post_id: int) -> Optional[Post]:
        """Get a post by ID."""
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        return result.scalar_one_or_none()
```

## Database Management

### Migrations with Alembic

```bash
# Create a new migration
make db-migrate msg="Add posts table"

# Apply migrations
make db-upgrade

# Rollback last migration
make db-downgrade

# Show migration history
make db-history

# Reset database (development only)
make db-reset
```

### Working with Models

The template includes base models with useful features:

```python
from src.your_package.models.base import BaseModel

class MyModel(BaseModel):
    """Your model inherits:
    - id: Primary key
    - created_at, updated_at: Timestamps
    - deleted_at, is_deleted: Soft delete
    """
    
    # Soft delete a record
    instance.soft_delete()
    
    # Restore a soft-deleted record
    instance.restore()
    
    # Filter active records only
    active_records = MyModel.filter_active(query)
```

## Testing

### Test Structure

```
tests/
├── unit/           # Unit tests (fast, isolated)
├── integration/    # Integration tests (database, services)
└── e2e/           # End-to-end tests (full application)
```

### Writing Tests

```python
# tests/unit/test_post_service.py
import pytest
from unittest.mock import AsyncMock

from src.your_package.services.post_service import PostService
from src.your_package.schemas.post import PostCreate

@pytest.mark.asyncio
async def test_create_post():
    """Test post creation."""
    # Mock database
    mock_db = AsyncMock()
    service = PostService(mock_db)
    
    # Test data
    post_data = PostCreate(title="Test", content="Content")
    
    # Test
    result = await service.create_post(post_data)
    
    # Assertions
    assert result.title == "Test"
    mock_db.add.assert_called_once()
```

### Running Tests

```bash
# All tests
make test

# Specific test types
make test-unit
make test-integration
make test-e2e

# With coverage
make test-cov

# Specific test file
uv run pytest tests/unit/test_post_service.py -v
```

## Code Quality

### Linting and Formatting

The template includes comprehensive code quality tools:

```bash
# Run all linting
make lint

# Format code
make format

# Run pre-commit hooks
make pre-commit
```

**Tools included:**
- **Ruff**: Fast Python linter and formatter (replaces Black and isort)
- **MyPy**: Static type checking
- **Pre-commit**: Git hooks for quality
- **uv**: Fast Python package manager

### Pre-commit Hooks

Automatically run quality checks on commit:

```bash
# Install hooks
uv run pre-commit install

# Run manually
make pre-commit
```

## Debugging

### Development Server

```bash
# Run with debug mode
DEBUG=true make dev

# Run with specific log level
LOG_LEVEL=DEBUG make dev
```

### Database Debugging

```bash
# Check database connection
make db-current

# View migration status
make db-history

# Reset database (development)
make db-reset
```

### Service Debugging

```bash
# Check service URLs
make service-urls-list

# Test service health
make service-urls-health

# Test connectivity
make service-urls-test
```

## Performance

### Database Optimization

```python
# Use async sessions
async with AsyncSessionLocal() as session:
    result = await session.execute(select(User))

# Eager loading relationships
query = select(Post).options(selectinload(Post.author))

# Pagination
query = query.offset(skip).limit(limit)
```

### Caching

```python
# Redis caching example
import redis.asyncio as redis

async def get_cached_data(key: str):
    r = redis.from_url(settings.REDIS_URL)
    cached = await r.get(key)
    if cached:
        return json.loads(cached)
    return None
```

## Security

### Authentication

```python
from src.your_package.api.v1.dependencies import get_current_user_id

@router.get("/protected")
async def protected_endpoint(
    current_user_id: str = Depends(get_current_user_id)
):
    """Protected endpoint requiring authentication."""
    return {"user_id": current_user_id}
```

### Input Validation

```python
from pydantic import Field, validator

class UserCreate(BaseSchema):
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        return v
```

## Monitoring

### Health Checks

```python
# Built-in health check
GET /api/v1/health

# Service-specific health
GET /api/v1/services
```

### Logging

```python
import structlog

logger = structlog.get_logger()

# Structured logging
logger.info("User created", user_id=user.id, email=user.email)
logger.error("Database error", error=str(e), query=query)
```

## Next Steps

- **Deployment**: See the [deployment guide](../deployment/index.md)
- **Architecture**: Learn about the [system architecture](../architecture/index.md)
- **API Reference**: Explore the [API documentation](../api/index.md)
