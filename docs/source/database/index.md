# Database Guide

The Python MVP Template uses SQLAlchemy 2.0 with async support, Alembic for migrations, and includes powerful features like soft delete and automatic timestamps.

## Database Stack

- **SQLAlchemy 2.0**: Modern async ORM with type safety
- **Alembic**: Database migration management
- **PostgreSQL**: Primary database (production)
- **SQLite**: Development and testing
- **asyncpg**: Async PostgreSQL driver
- **aiosqlite**: Async SQLite driver

## Configuration

### Database URLs

Configure database connections in `.env`:

```bash
# PostgreSQL (Production/Development)
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/myapp

# SQLite (Development/Testing)
DATABASE_URL=sqlite+aiosqlite:///./myapp.db

# Test Database
TEST_DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/myapp_test
```

### Connection Settings

```python
# src/your_package/core/config.py
class Settings(BaseSettings):
    # Database configuration
    DATABASE_URL: Optional[PostgresDsn] = None
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "myapp"
    
    @property
    def database_url(self) -> str:
        """Construct database URL."""
        if self.DATABASE_URL:
            return str(self.DATABASE_URL)
        
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
```

## Models

### Base Model

All models inherit from `BaseModel` which provides:

```python
# src/your_package/models/base.py
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
    
    def soft_delete(self):
        """Mark record as deleted."""
        self.is_deleted = True
        self.deleted_at = func.now()
    
    def restore(self):
        """Restore soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
```

### Model Mixins

Use mixins for common functionality:

```python
# src/your_package/models/mixins.py
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

# Usage
class Post(BaseModel, TitleMixin, DescriptionMixin):
    __tablename__ = "posts"
    
    content = Column(Text, nullable=False)
```

### Example Models

```python
# src/your_package/models/user.py
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from .base import BaseModel

class User(BaseModel):
    """User model with authentication."""
    
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    posts = relationship("Post", back_populates="author")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}')>"
```

```python
# src/your_package/models/post.py
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .base import BaseModel
from .mixins import TitleMixin

class Post(BaseModel, TitleMixin):
    """Blog post model."""
    
    __tablename__ = "posts"
    
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="posts")
    
    def __repr__(self) -> str:
        return f"<Post(id={self.id}, title='{self.title}')>"
```

## Database Sessions

### Session Management

```python
# src/your_package/core/database.py
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.DEBUG,
    future=True,
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Database session dependency."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### Using Sessions

```python
# In FastAPI endpoints
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

@router.get("/users/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID."""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## Queries

### Basic Queries

```python
from sqlalchemy import select, insert, update, delete
from sqlalchemy.orm import selectinload

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

# Select with relationships
result = await db.execute(
    select(User).options(selectinload(User.posts))
)
users_with_posts = result.scalars().all()
```

### Advanced Queries

```python
# Pagination
result = await db.execute(
    select(User)
    .offset(skip)
    .limit(limit)
    .order_by(User.created_at.desc())
)
users = result.scalars().all()

# Filtering and searching
result = await db.execute(
    select(User)
    .where(User.email.contains("@example.com"))
    .where(User.is_active == True)
)

# Joins
result = await db.execute(
    select(User, Post)
    .join(Post, User.id == Post.author_id)
    .where(Post.title.contains("Python"))
)

# Aggregations
from sqlalchemy import func

result = await db.execute(
    select(func.count(Post.id))
    .where(Post.author_id == user_id)
)
post_count = result.scalar()
```

### Soft Delete Queries

```python
# Filter active records only
active_users = await db.execute(
    select(User).where(User.is_deleted == False)
)

# Include soft-deleted records
all_users = await db.execute(
    select(User)  # No filter on is_deleted
)

# Only soft-deleted records
deleted_users = await db.execute(
    select(User).where(User.is_deleted == True)
)
```

## Migrations with Alembic

### Migration Commands

```bash
# Create a new migration
make db-migrate msg="Add users table"

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

### Migration Files

Alembic generates migration files in `alembic/versions/`:

```python
# alembic/versions/001_add_users_table.py
"""Add users table

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
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    op.create_index('ix_users_email', 'users', ['email'])

def downgrade() -> None:
    """Downgrade database schema."""
    op.drop_index('ix_users_email', 'users')
    op.drop_table('users')
```

### Custom Migrations

```python
# Custom data migration
def upgrade() -> None:
    """Add default admin user."""
    # Schema changes
    op.add_column('users', sa.Column('role', sa.String(50), nullable=True))
    
    # Data changes
    connection = op.get_bind()
    connection.execute(
        sa.text("""
            INSERT INTO users (email, username, hashed_password, role, is_active)
            VALUES ('admin@example.com', 'admin', 'hashed_password', 'admin', true)
        """)
    )
```

## Database Services

### Service Pattern

```python
# src/your_package/services/user_service.py
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

class UserService:
    """Service for user operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        user = User(**user_data.model_dump(exclude={'password'}))
        user.hashed_password = hash_password(user_data.password)
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def get_user(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(
                User.id == user_id,
                User.is_deleted == False
            )
        )
        return result.scalar_one_or_none()
    
    async def get_users(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[User]:
        """Get list of users."""
        result = await self.db.execute(
            select(User)
            .where(User.is_deleted == False)
            .offset(skip)
            .limit(limit)
            .order_by(User.created_at.desc())
        )
        return result.scalars().all()
    
    async def update_user(
        self, 
        user_id: int, 
        user_data: UserUpdate
    ) -> Optional[User]:
        """Update user."""
        user = await self.get_user(user_id)
        if not user:
            return None
        
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete_user(self, user_id: int) -> bool:
        """Soft delete user."""
        user = await self.get_user(user_id)
        if not user:
            return False
        
        user.soft_delete()
        await self.db.commit()
        return True
```

## Performance Optimization

### Query Optimization

```python
# Eager loading relationships
result = await db.execute(
    select(User)
    .options(selectinload(User.posts))
    .where(User.id == user_id)
)

# Select specific columns
result = await db.execute(
    select(User.id, User.email, User.username)
    .where(User.is_active == True)
)

# Use indexes
# Add indexes in models
class User(BaseModel):
    email = Column(String(255), unique=True, index=True)
    username = Column(String(100), index=True)
```

### Connection Pooling

```python
# Configure connection pool
engine = create_async_engine(
    database_url,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,
    pool_recycle=3600,
)
```

### Bulk Operations

```python
# Bulk insert
users_data = [
    {"email": "user1@example.com", "username": "user1"},
    {"email": "user2@example.com", "username": "user2"},
]

await db.execute(insert(User), users_data)
await db.commit()

# Bulk update
await db.execute(
    update(User)
    .where(User.is_active == False)
    .values(is_deleted=True)
)
await db.commit()
```

## Testing

### Test Database Setup

```python
# tests/conftest.py
@pytest.fixture(scope="function")
async def db_session() -> AsyncSession:
    """Create test database session."""
    engine = create_async_engine(settings.test_database_url)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    TestSessionLocal = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
```

### Model Testing

```python
def test_user_model():
    """Test user model creation."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="hashed"
    )
    
    assert user.email == "test@example.com"
    assert user.is_active is True
    assert user.is_deleted is False

def test_soft_delete():
    """Test soft delete functionality."""
    user = User(email="test@example.com", username="test")
    
    user.soft_delete()
    assert user.is_deleted is True
    assert user.deleted_at is not None
```

## Monitoring

### Query Logging

```python
# Enable SQL logging in development
engine = create_async_engine(
    database_url,
    echo=True,  # Log all SQL queries
    echo_pool=True,  # Log connection pool events
)
```

### Performance Monitoring

```python
import time
from sqlalchemy import event

@event.listens_for(engine.sync_engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    context._query_start_time = time.time()

@event.listens_for(engine.sync_engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time.time() - context._query_start_time
    if total > 0.1:  # Log slow queries
        logger.warning(f"Slow query: {total:.2f}s - {statement[:100]}")
```

## Best Practices

### Model Design

1. **Use meaningful table and column names**
2. **Add appropriate indexes** for frequently queried columns
3. **Use foreign keys** to maintain referential integrity
4. **Include soft delete** for important data
5. **Add timestamps** for audit trails

### Query Patterns

1. **Use async/await** for all database operations
2. **Handle exceptions** gracefully
3. **Use transactions** for multi-step operations
4. **Optimize N+1 queries** with eager loading
5. **Paginate large result sets**

### Migration Management

1. **Review migrations** before applying
2. **Test migrations** on staging first
3. **Backup database** before major changes
4. **Use descriptive migration messages**
5. **Keep migrations small** and focused

Ready to build robust database applications? Your data is in good hands! 🗄️
