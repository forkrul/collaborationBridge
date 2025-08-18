# Developer Guide

This comprehensive guide covers everything developers need to know to work effectively with the codebase.

## Architecture Overview

The application follows a modern, layered architecture designed for maintainability, testability, and scalability.

### Application Layers

```
┌─────────────────────────────────────┐
│           API Layer                 │  ← FastAPI routes, middleware
├─────────────────────────────────────┤
│         Service Layer               │  ← Business logic, orchestration
├─────────────────────────────────────┤
│          Model Layer                │  ← SQLAlchemy models, database
├─────────────────────────────────────┤
│          Core Layer                 │  ← Configuration, utilities
└─────────────────────────────────────┘
```

### Directory Structure

```
src/project_name/
├── api/                    # API layer
│   ├── v1/                # API version 1
│   │   ├── router.py      # Main API router
│   │   ├── dependencies.py # Dependency injection
│   │   └── endpoints/     # Individual endpoint modules
│   └── middleware/        # Custom middleware
├── core/                  # Core configuration
│   ├── config.py         # Application settings
│   ├── database.py       # Database configuration
│   └── security.py       # Security utilities
├── models/               # Data models
│   ├── base.py          # Base model with common fields
│   ├── mixins.py        # Reusable model mixins
│   └── user.py          # User model example
├── schemas/             # Pydantic schemas
│   ├── base.py         # Base schemas
│   └── user.py         # User schemas
├── services/           # Business logic
│   └── user_service.py # User service example
├── utils/              # Utility functions
│   └── service_url_manager.py # URL management
└── main.py            # FastAPI application
```

## Development Workflow

### Setting Up Development Environment

#### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/your-project.git
cd your-project

# Option 1: Nix (Recommended)
nix develop
make install

# Option 2: Manual with uv
uv sync --extra dev --extra test --extra docs
```

#### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
vim .env
```

#### 3. Database Setup

```bash
# Start services (Nix)
services_start

# Run migrations
make db-upgrade

# Create test data (optional)
make db-seed
```

#### 4. Start Development

```bash
# Start development server
make dev

# In another terminal, run tests
make test

# Check code quality
make lint
```

### Daily Development Workflow

```bash
# 1. Start your day
git pull origin master
nix develop  # or activate your environment
services_start

# 2. Create feature branch
git checkout -b feature/awesome-feature

# 3. Develop with TDD
make test-watch  # Run tests on file changes
make dev         # Development server with hot reload

# 4. Ensure quality
make lint
make format
make test

# 5. Commit and push
git add .
git commit -m "Add awesome feature"
git push origin feature/awesome-feature

# 6. Create pull request
# Use GitHub interface or gh CLI
```

## Code Organization

### Models (SQLAlchemy)

Models represent database entities and business objects.

#### Base Model

All models inherit from `BaseModel`:

```python
# src/project_name/models/base.py
from sqlalchemy import Column, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class BaseModel(Base):
    """Base model with common fields."""
    
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Soft delete fields
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
```

#### Model Example

```python
# src/project_name/models/post.py
from sqlalchemy import Column, String, Text, Integer, ForeignKey
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
    
    def __repr__(self) -> str:
        return f"<Post(id={self.id}, title='{self.title}')>"
```

#### Model Mixins

Reusable functionality through mixins:

```python
# src/project_name/models/mixins.py
from sqlalchemy import Column, String, Text

class TitleMixin:
    """Mixin for models with titles."""
    title = Column(String(255), nullable=False, index=True)

class DescriptionMixin:
    """Mixin for models with descriptions."""
    description = Column(Text, nullable=True)

class SlugMixin:
    """Mixin for models with URL slugs."""
    slug = Column(String(255), unique=True, index=True)
```

### Schemas (Pydantic)

Schemas define API input/output data structures and validation.

#### Base Schemas

```python
# src/project_name/schemas/base.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    model_config = ConfigDict(from_attributes=True)

class TimestampSchema(BaseSchema):
    """Schema with timestamp fields."""
    created_at: datetime
    updated_at: Optional[datetime] = None

class IDSchema(BaseSchema):
    """Schema with ID field."""
    id: int
```

#### Schema Example

```python
# src/project_name/schemas/post.py
from typing import Optional
from pydantic import Field

from .base import BaseSchema, TimestampSchema, IDSchema

class PostBase(BaseSchema):
    """Base post schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    content: str = Field(..., min_length=1)

class PostCreate(PostBase):
    """Schema for creating posts."""
    pass

class PostUpdate(BaseSchema):
    """Schema for updating posts."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    content: Optional[str] = Field(None, min_length=1)

class PostResponse(PostBase, IDSchema, TimestampSchema):
    """Schema for post responses."""
    author_id: int
```

### Services (Business Logic)

Services contain business logic and orchestrate operations.

#### Service Example

```python
# src/project_name/services/post_service.py
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from ..models.post import Post
from ..schemas.post import PostCreate, PostUpdate

class PostService:
    """Service for post operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_post(self, post_data: PostCreate, author_id: int) -> Post:
        """Create a new post."""
        post = Post(**post_data.model_dump(), author_id=author_id)
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        return post
    
    async def get_post(self, post_id: int) -> Optional[Post]:
        """Get a post by ID."""
        result = await self.db.execute(
            select(Post).where(
                and_(Post.id == post_id, Post.is_deleted == False)
            )
        )
        return result.scalar_one_or_none()
    
    async def get_posts(
        self, 
        skip: int = 0, 
        limit: int = 100,
        author_id: Optional[int] = None
    ) -> List[Post]:
        """Get list of posts."""
        query = select(Post).where(Post.is_deleted == False)
        
        if author_id:
            query = query.where(Post.author_id == author_id)
        
        query = query.offset(skip).limit(limit).order_by(Post.created_at.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_post(
        self, 
        post_id: int, 
        post_data: PostUpdate,
        author_id: int
    ) -> Optional[Post]:
        """Update a post."""
        post = await self.get_post(post_id)
        if not post or post.author_id != author_id:
            return None
        
        update_data = post_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(post, field, value)
        
        await self.db.commit()
        await self.db.refresh(post)
        return post
    
    async def delete_post(self, post_id: int, author_id: int) -> bool:
        """Soft delete a post."""
        post = await self.get_post(post_id)
        if not post or post.author_id != author_id:
            return False
        
        post.soft_delete()
        await self.db.commit()
        return True
```

### API Endpoints

API endpoints handle HTTP requests and responses.

#### Endpoint Example

```python
# src/project_name/api/v1/endpoints/posts.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ....core.database import get_db
from ....api.v1.dependencies import get_current_user_id
from ....schemas.post import PostCreate, PostUpdate, PostResponse
from ....services.post_service import PostService

router = APIRouter()

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post."""
    service = PostService(db)
    post = await service.create_post(post_data, current_user_id)
    return post

@router.get("/", response_model=List[PostResponse])
async def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    author_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """List posts with pagination."""
    service = PostService(db)
    posts = await service.get_posts(skip=skip, limit=limit, author_id=author_id)
    return posts

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a post by ID."""
    service = PostService(db)
    post = await service.get_post(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Update a post."""
    service = PostService(db)
    post = await service.update_post(post_id, post_data, current_user_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or access denied"
        )
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Delete a post."""
    service = PostService(db)
    success = await service.delete_post(post_id, current_user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or access denied"
        )
```

#### Router Integration

```python
# src/project_name/api/v1/router.py
from fastapi import APIRouter
from .endpoints import posts, users, auth

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
```

## Database Management

### Migrations with Alembic

#### Creating Migrations

```bash
# Create a new migration
make db-migrate msg="Add posts table"

# This generates a file like: alembic/versions/001_add_posts_table.py
```

#### Migration File Example

```python
# alembic/versions/001_add_posts_table.py
"""Add posts table

Revision ID: 001
Revises: 
Create Date: 2024-01-15 10:30:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Upgrade database schema."""
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_posts_title', 'posts', ['title'])

def downgrade() -> None:
    """Downgrade database schema."""
    op.drop_index('ix_posts_title', 'posts')
    op.drop_table('posts')
```

#### Migration Commands

```bash
# Apply migrations
make db-upgrade

# Rollback last migration
make db-downgrade

# Show migration history
make db-history

# Show current revision
make db-current

# Reset database (development only)
make db-reset
```

### Database Queries

#### Basic Queries

```python
# Select single record
result = await db.execute(
    select(User).where(User.id == user_id)
)
user = result.scalar_one_or_none()

# Select multiple records
result = await db.execute(
    select(User).where(User.is_active == True)
)
users = result.scalars().all()
```

#### Advanced Queries

```python
# Joins and relationships
result = await db.execute(
    select(Post)
    .join(User)
    .where(User.is_active == True)
    .options(selectinload(Post.author))
)

# Pagination
result = await db.execute(
    select(Post)
    .offset(skip)
    .limit(limit)
    .order_by(Post.created_at.desc())
)

# Filtering
result = await db.execute(
    select(Post)
    .where(
        and_(
            Post.title.contains(search_term),
            Post.is_deleted == False,
            Post.created_at >= start_date
        )
    )
)
```

## Testing

### Test Structure

```
tests/
├── conftest.py              # Pytest configuration and fixtures
├── unit/                    # Unit tests (fast, isolated)
│   ├── test_models.py       # Model tests
│   ├── test_schemas.py      # Schema validation tests
│   ├── test_services.py     # Service logic tests
│   └── test_utils.py        # Utility function tests
├── integration/             # Integration tests (database, services)
│   ├── test_api.py          # API endpoint tests
│   ├── test_database.py     # Database integration
│   └── test_auth.py         # Authentication flow
└── e2e/                     # End-to-end tests (full application)
    ├── features/            # BDD feature files
    └── steps/               # BDD step definitions
```

### Writing Tests

#### Unit Test Example

```python
# tests/unit/test_post_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock

from src.project_name.services.post_service import PostService
from src.project_name.schemas.post import PostCreate

@pytest.mark.asyncio
async def test_create_post():
    """Test post creation service."""
    # Mock database session
    mock_db = AsyncMock()
    mock_post = MagicMock()
    mock_post.id = 1
    mock_post.title = "Test Post"
    
    # Create service
    service = PostService(mock_db)
    
    # Test data
    post_data = PostCreate(
        title="Test Post",
        content="Test content"
    )
    
    # Mock the created post
    with patch('src.project_name.models.post.Post') as MockPost:
        MockPost.return_value = mock_post
        
        result = await service.create_post(post_data, author_id=1)
        
        # Assertions
        assert result.id == 1
        assert result.title == "Test Post"
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
```

#### Integration Test Example

```python
# tests/integration/test_posts_api.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_post(async_client: AsyncClient, auth_headers):
    """Test post creation endpoint."""
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content",
        "description": "Test description"
    }
    
    response = await async_client.post(
        "/api/v1/posts/",
        json=post_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Post"
    assert data["content"] == "This is a test post content"
    assert "id" in data
    assert "created_at" in data
```

### Running Tests

```bash
# Run all tests
make test

# Run specific test types
make test-unit
make test-integration
make test-e2e

# Run with coverage
make test-cov

# Run specific test file
uv run pytest tests/unit/test_post_service.py -v

# Run tests matching pattern
uv run pytest -k "test_create" -v

# Run tests with debugging
uv run pytest --pdb
```

## Code Quality

### Linting and Formatting

The project uses several tools for code quality:

```bash
# Run all quality checks
make lint

# Individual tools
uv run ruff check src/              # Fast linting and formatting
uv run ruff format src/             # Fast formatting
uv run mypy src/                    # Type checking
```

### Pre-commit Hooks

Automatically run quality checks on commit:

```bash
# Install hooks
make install-hooks

# Run manually
make pre-commit

# Skip hooks (not recommended)
git commit --no-verify
```

### Type Hints

Use type hints throughout the codebase:

```python
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

async def get_users(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[Dict[str, Any]] = None
) -> List[User]:
    """Get users with optional filtering."""
    # Implementation here
    pass
```

## Performance Optimization

### Database Performance

```python
# Use eager loading for relationships
result = await db.execute(
    select(Post)
    .options(selectinload(Post.author))
    .where(Post.is_deleted == False)
)

# Use indexes for frequently queried fields
class Post(BaseModel):
    title = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), index=True)

# Batch operations for bulk data
await db.execute(
    insert(Post),
    [{"title": f"Post {i}", "content": f"Content {i}"} for i in range(100)]
)
```

### API Performance

```python
# Use background tasks for heavy operations
from fastapi import BackgroundTasks

@router.post("/posts/{post_id}/process")
async def process_post(
    post_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Process post in background."""
    background_tasks.add_task(heavy_processing_task, post_id)
    return {"message": "Processing started"}

# Implement caching for expensive operations
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_computation(param: str) -> str:
    # Expensive operation here
    return result
```

## Deployment

### Environment Configuration

```python
# src/project_name/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Environment-specific settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Docker Deployment

```bash
# Build production image
docker build -f docker/Dockerfile -t project:latest .

# Run with environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY=your-secret-key \
  project:latest
```

### Health Checks

Implement comprehensive health checks:

```python
@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with dependency status."""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    # Database check
    try:
        await db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {"status": "healthy"}
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"
    
    return health_status
```

## Frontend Development

### UX Development Process

For frontend/UX development, follow the comprehensive [UX Development PRD](../ux-development-prd.md) which includes:

- **React Interface Development**: Modern React 18 with TypeScript
- **Design System**: Dark-mode-first Tailwind CSS implementation
- **Testing Strategy**: Comprehensive coverage with Playwright + Behave
- **Accessibility**: WCAG 2.1 AA compliance requirements
- **Performance**: Core Web Vitals optimization

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route-based page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API integration layer
│   ├── stores/             # State management (Zustand)
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── tests/
│   ├── unit/               # Jest + React Testing Library
│   ├── integration/        # Playwright integration tests
│   └── e2e/               # Playwright + Behave E2E tests
└── docs/
    └── storybook/          # Component documentation
```

### Development Workflow

1. **Follow the PRD**: All frontend development should align with the [UX Development PRD](../ux-development-prd.md)
2. **API-First Development**: Implement API endpoints with TDD before UI components
3. **Component-Driven Development**: Build components in isolation with Storybook
4. **Test-Driven Development**: Write tests before implementation
5. **Accessibility-First**: Ensure WCAG compliance from the start

Ready to start developing? Check out the [Quick Start Guide](../quickstart/index.md) to set up your development environment! 🚀
