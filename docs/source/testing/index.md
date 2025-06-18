# Testing Guide

The Python MVP Template includes a comprehensive testing framework with unit, integration, and end-to-end tests.

## Testing Philosophy

The template follows the testing pyramid:

```
    /\
   /  \     E2E Tests (Few, Slow, High Confidence)
  /____\
 /      \   Integration Tests (Some, Medium Speed)
/__________\ Unit Tests (Many, Fast, Low-level)
```

- **Unit Tests**: Fast, isolated tests for individual functions/classes
- **Integration Tests**: Test component interactions (database, services)
- **E2E Tests**: Full application workflow tests with BDD

## Test Structure

```
tests/
├── conftest.py              # Pytest configuration and fixtures
├── unit/                    # Unit tests
│   ├── test_models.py       # Model tests
│   ├── test_schemas.py      # Schema validation tests
│   ├── test_services.py     # Service logic tests
│   └── test_utils.py        # Utility function tests
├── integration/             # Integration tests
│   ├── test_api.py          # API endpoint tests
│   ├── test_database.py     # Database integration
│   └── test_auth.py         # Authentication flow
└── e2e/                     # End-to-end tests
    ├── features/            # BDD feature files
    │   └── health.feature   # Example feature
    └── steps/               # BDD step definitions
        └── health_steps.py  # Step implementations
```

## Running Tests

### Quick Commands

```bash
# Run all tests
make test

# Run with coverage report
make test-cov

# Run specific test types
make test-unit
make test-integration
make test-e2e

# Run specific test file
poetry run pytest tests/unit/test_models.py -v

# Run tests matching pattern
poetry run pytest -k "test_user" -v
```

### Pytest Options

```bash
# Verbose output
poetry run pytest -v

# Stop on first failure
poetry run pytest -x

# Run in parallel
poetry run pytest -n auto

# Show coverage
poetry run pytest --cov=src --cov-report=html

# Debug mode
poetry run pytest --pdb
```

## Unit Tests

Unit tests are fast, isolated tests that test individual components.

### Testing Models

```python
# tests/unit/test_models.py
import pytest
from datetime import datetime

from src.your_package.models.user import User

def test_user_creation():
    """Test user model creation."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="hashed_password"
    )
    
    assert user.email == "test@example.com"
    assert user.username == "testuser"
    assert user.is_active is True
    assert user.is_superuser is False

def test_user_soft_delete():
    """Test user soft delete functionality."""
    user = User(email="test@example.com", username="testuser")
    
    # Initially not deleted
    assert user.is_deleted is False
    assert user.deleted_at is None
    
    # Soft delete
    user.soft_delete()
    assert user.is_deleted is True
    assert user.deleted_at is not None
    
    # Restore
    user.restore()
    assert user.is_deleted is False
    assert user.deleted_at is None
```

### Testing Schemas

```python
# tests/unit/test_schemas.py
import pytest
from pydantic import ValidationError

from src.your_package.schemas.user import UserCreate, UserResponse

def test_user_create_valid():
    """Test valid user creation schema."""
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "SecurePass123"
    }
    
    schema = UserCreate(**data)
    assert schema.email == "test@example.com"
    assert schema.username == "testuser"

def test_user_create_invalid_email():
    """Test user creation with invalid email."""
    data = {
        "email": "invalid-email",
        "username": "testuser",
        "password": "SecurePass123"
    }
    
    with pytest.raises(ValidationError) as exc_info:
        UserCreate(**data)
    
    assert "email" in str(exc_info.value)

def test_user_response_serialization():
    """Test user response serialization."""
    data = {
        "id": 1,
        "email": "test@example.com",
        "username": "testuser",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    schema = UserResponse(**data)
    json_data = schema.model_dump()
    
    assert json_data["id"] == 1
    assert json_data["email"] == "test@example.com"
```

### Testing Services

```python
# tests/unit/test_services.py
import pytest
from unittest.mock import AsyncMock, MagicMock

from src.your_package.services.user_service import UserService
from src.your_package.schemas.user import UserCreate

@pytest.mark.asyncio
async def test_create_user():
    """Test user creation service."""
    # Mock database session
    mock_db = AsyncMock()
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.email = "test@example.com"
    
    # Mock database operations
    mock_db.add = MagicMock()
    mock_db.commit = AsyncMock()
    mock_db.refresh = AsyncMock()
    
    # Create service
    service = UserService(mock_db)
    
    # Test data
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        password="password123"
    )
    
    # Mock the created user
    with patch('src.your_package.models.user.User') as MockUser:
        MockUser.return_value = mock_user
        
        result = await service.create_user(user_data)
        
        # Assertions
        assert result.id == 1
        assert result.email == "test@example.com"
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
```

## Integration Tests

Integration tests verify that components work together correctly.

### Testing API Endpoints

```python
# tests/integration/test_api.py
import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient

from src.your_package.main import app

@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """Test health check endpoint."""
    response = await async_client.get("/api/v1/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

@pytest.mark.asyncio
async def test_create_user(async_client: AsyncClient, db_session):
    """Test user creation endpoint."""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "SecurePass123"
    }
    
    response = await async_client.post("/api/v1/users/", json=user_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_user(async_client: AsyncClient, test_user):
    """Test get user endpoint."""
    response = await async_client.get(f"/api/v1/users/{test_user.id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email
```

### Testing Database Operations

```python
# tests/integration/test_database.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from src.your_package.models.user import User
from src.your_package.services.user_service import UserService

@pytest.mark.asyncio
async def test_user_crud_operations(db_session: AsyncSession):
    """Test complete CRUD operations for users."""
    service = UserService(db_session)
    
    # Create
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        password="password123"
    )
    user = await service.create_user(user_data)
    assert user.id is not None
    
    # Read
    retrieved_user = await service.get_user(user.id)
    assert retrieved_user.email == "test@example.com"
    
    # Update
    update_data = UserUpdate(username="newusername")
    updated_user = await service.update_user(user.id, update_data)
    assert updated_user.username == "newusername"
    
    # Delete (soft delete)
    await service.delete_user(user.id)
    deleted_user = await service.get_user(user.id)
    assert deleted_user is None  # Should not be found (soft deleted)
```

## End-to-End Tests

E2E tests use Behavior-Driven Development (BDD) with Gherkin syntax.

### Feature Files

```gherkin
# tests/e2e/features/user_management.feature
Feature: User Management
  As an API client
  I want to manage users
  So that I can handle user accounts

  Background:
    Given the API is running
    And the database is clean

  Scenario: Create a new user
    When I create a user with email "test@example.com"
    Then the user should be created successfully
    And the user should have an ID
    And the user should be retrievable by ID

  Scenario: User authentication
    Given a user exists with email "test@example.com"
    When I authenticate with valid credentials
    Then I should receive an access token
    And the token should be valid for API access

  Scenario: User profile update
    Given I am authenticated as a user
    When I update my profile with new information
    Then my profile should be updated
    And the changes should be persisted
```

### Step Definitions

```python
# tests/e2e/steps/user_steps.py
import requests
from behave import given, when, then

@given("the API is running")
def step_api_running(context):
    """Ensure API is accessible."""
    response = requests.get(f"{context.base_url}/api/v1/health")
    assert response.status_code == 200

@given("the database is clean")
def step_database_clean(context):
    """Ensure clean database state."""
    # Reset database or clean test data
    pass

@when('I create a user with email "{email}"')
def step_create_user(context, email):
    """Create a user with specified email."""
    user_data = {
        "email": email,
        "username": "testuser",
        "password": "SecurePass123"
    }
    
    response = requests.post(
        f"{context.base_url}/api/v1/users/",
        json=user_data
    )
    
    context.response = response
    context.user_data = response.json() if response.status_code == 201 else None

@then("the user should be created successfully")
def step_user_created(context):
    """Verify user creation was successful."""
    assert context.response.status_code == 201
    assert context.user_data is not None

@then("the user should have an ID")
def step_user_has_id(context):
    """Verify user has an ID."""
    assert "id" in context.user_data
    assert context.user_data["id"] is not None
```

## Test Fixtures

### Database Fixtures

```python
# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from src.your_package.core.config import settings
from src.your_package.models.base import Base

@pytest.fixture(scope="function")
async def db_session() -> AsyncSession:
    """Create a test database session."""
    engine = create_async_engine(settings.test_database_url)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    TestSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
    
    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def test_user(db_session: AsyncSession):
    """Create a test user."""
    from src.your_package.models.user import User
    
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="hashed_password"
    )
    
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    return user
```

### API Client Fixtures

```python
@pytest.fixture
async def async_client(override_get_db) -> AsyncClient:
    """Create an async test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def authenticated_client(async_client: AsyncClient, test_user):
    """Create an authenticated test client."""
    # Add authentication headers
    token = create_access_token(subject=test_user.id)
    async_client.headers.update({"Authorization": f"Bearer {token}"})
    return async_client
```

## Test Data Management

### Factory Pattern

```python
# tests/factories.py
import factory
from factory import Faker

from src.your_package.models.user import User

class UserFactory(factory.Factory):
    """Factory for creating test users."""
    
    class Meta:
        model = User
    
    email = Faker("email")
    username = Faker("user_name")
    full_name = Faker("name")
    hashed_password = "hashed_password"
    is_active = True
    is_superuser = False

# Usage in tests
def test_user_creation():
    user = UserFactory()
    assert user.email is not None
    assert user.username is not None
```

### Test Data Cleanup

```python
@pytest.fixture(autouse=True)
async def cleanup_test_data(db_session: AsyncSession):
    """Automatically clean up test data after each test."""
    yield
    
    # Clean up test data
    await db_session.execute("DELETE FROM users WHERE email LIKE '%test%'")
    await db_session.commit()
```

## Mocking and Patching

### External Service Mocking

```python
import pytest
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
@patch('src.your_package.services.email_service.send_email')
async def test_user_registration_with_email(mock_send_email):
    """Test user registration sends welcome email."""
    mock_send_email.return_value = True
    
    # Test user registration
    # ... test code ...
    
    # Verify email was sent
    mock_send_email.assert_called_once()
```

### Database Mocking

```python
@pytest.mark.asyncio
async def test_service_with_db_error():
    """Test service handles database errors gracefully."""
    mock_db = AsyncMock()
    mock_db.commit.side_effect = Exception("Database error")
    
    service = UserService(mock_db)
    
    with pytest.raises(Exception):
        await service.create_user(user_data)
```

## Performance Testing

### Load Testing

```python
# tests/performance/test_load.py
import asyncio
import time
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_api_load():
    """Test API performance under load."""
    async def make_request():
        async with AsyncClient(app=app) as client:
            response = await client.get("/api/v1/health")
            return response.status_code == 200
    
    # Run 100 concurrent requests
    start_time = time.time()
    tasks = [make_request() for _ in range(100)]
    results = await asyncio.gather(*tasks)
    end_time = time.time()
    
    # Assertions
    assert all(results)  # All requests successful
    assert end_time - start_time < 5.0  # Completed within 5 seconds
```

## Test Configuration

### Pytest Configuration

```ini
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    -v
    --strict-markers
    --disable-warnings
    --cov=src
    --cov-report=term-missing
    --cov-report=html
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    slow: Slow tests
asyncio_mode = auto
```

### Coverage Configuration

```ini
# .coveragerc
[run]
source = src
omit = 
    */tests/*
    */venv/*
    */migrations/*
    */__pycache__/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install poetry
        poetry install
    
    - name: Run tests
      run: |
        poetry run pytest --cov=src --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## Best Practices

### Test Organization

1. **One test per function/method**
2. **Clear test names** describing what is being tested
3. **Arrange-Act-Assert** pattern
4. **Independent tests** that don't depend on each other
5. **Fast unit tests**, slower integration tests

### Test Data

1. **Use factories** for creating test data
2. **Clean up** after each test
3. **Isolate** test data from production
4. **Mock external dependencies**

### Assertions

1. **Specific assertions** rather than generic ones
2. **Test both success and failure cases**
3. **Verify side effects** (database changes, API calls)
4. **Use appropriate assertion methods**

Ready to write comprehensive tests? Let's ensure your code is bulletproof! 🛡️
