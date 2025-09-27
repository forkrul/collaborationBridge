import uuid

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.main import app
from src.collaboration_bridge.api import deps
from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.crud.contact import contact_crud
from src.collaboration_bridge.schemas.contact import ContactCreate
from src.collaboration_bridge.models.contact import ContactLevel


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """Create and save a test user."""
    user = User(
        email=f"testuser_{uuid.uuid4()}@example.com",
        full_name="Test User",
        hashed_password="hashed_password",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
def mock_get_current_user(test_user: User):
    """Mock the get_current_user dependency."""

    async def override_get_current_user() -> User:
        return test_user

    return override_get_current_user


@pytest.mark.asyncio
async def test_create_contact_api(
    client: AsyncClient, mock_get_current_user: callable, db_session: AsyncSession
):
    """Test creating a contact via the API."""
    app.dependency_overrides[deps.get_current_user] = mock_get_current_user

    contact_data = {
        "name": "John Doe",
        "title": "Software Engineer",
        "level": ContactLevel.DIRECT_MANAGER.value,
        "common_ground_notes": "Met at a conference.",
    }
    response = await client.post("/api/v1/contacts/", json=contact_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == contact_data["name"]
    assert "id" in data

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_read_contacts_api(
    client: AsyncClient, mock_get_current_user: callable, test_user: User, db_session: AsyncSession
):
    """Test reading contacts via the API."""
    app.dependency_overrides[deps.get_current_user] = mock_get_current_user

    # Create a contact first
    await contact_crud.create_with_owner(
        db=db_session, obj_in=ContactCreate(name="Jane Doe", level=ContactLevel.MENTOR), user_id=test_user.id
    )

    response = await client.get("/api/v1/contacts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Jane Doe"

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_update_contact_api(
    client: AsyncClient, mock_get_current_user: callable, test_user: User, db_session: AsyncSession
):
    """Test updating a contact via the API."""
    app.dependency_overrides[deps.get_current_user] = mock_get_current_user

    # Create a contact
    contact = await contact_crud.create_with_owner(
        db=db_session,
        obj_in=ContactCreate(name="Update Me", level=ContactLevel.SKIP_LEVEL),
        user_id=test_user.id,
    )

    update_data = {"title": "Senior Software Engineer"}
    response = await client.patch(f"/api/v1/contacts/{contact.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Senior Software Engineer"
    assert data["name"] == "Update Me"

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_delete_contact_api(
    client: AsyncClient, mock_get_current_user: callable, test_user: User, db_session: AsyncSession
):
    """Test deleting a contact via the API."""
    app.dependency_overrides[deps.get_current_user] = mock_get_current_user

    # Create a contact
    contact = await contact_crud.create_with_owner(
        db=db_session,
        obj_in=ContactCreate(name="Delete Me", level=ContactLevel.SENIOR_LEADER),
        user_id=test_user.id,
    )

    response = await client.delete(f"/api/v1/contacts/{contact.id}")
    assert response.status_code == 204

    # Verify it's soft-deleted
    response = await client.get(f"/api/v1/contacts/{contact.id}")
    assert response.status_code == 404

    app.dependency_overrides.clear()