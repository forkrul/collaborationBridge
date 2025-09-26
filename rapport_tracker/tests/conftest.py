import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.app.main import app
from src.app.core.database import Base, get_db_session
from src.app.core.config import settings

# Ensure we use the test database URL
TEST_DATABASE_URL = settings.DATABASE_URL_TEST

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Creates a new database session for a test, managing setup and teardown."""
    # Set environment to testing
    settings.ENVIRONMENT = "testing"

    engine = create_async_engine(TEST_DATABASE_URL)

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create an AsyncClient for API testing with the DB dependency overridden."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c

    app.dependency_overrides.clear()