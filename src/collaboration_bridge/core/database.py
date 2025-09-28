import uuid
from typing import AsyncGenerator

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from collaboration_bridge.core.config import settings

# Create the async engine
engine = create_async_engine(settings.async_database_url)

# Create a session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    """
    Base declarative class for all models. Standardizes on UUIDs for primary keys.
    """
    # Use UUIDs for primary keys
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency to provide a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
