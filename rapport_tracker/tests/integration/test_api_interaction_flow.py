import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
import uuid

from src.app.models.user import User
from src.app.models.contact import Contact, ContactLevel
from src.app.models.rapport import RapportTactic
from src.app.core.seed_data import SEED_TACTICS

# Helper function to create a prerequisite user
async def create_test_user(db: AsyncSession) -> User:
    """Creates a dummy user for testing relationships."""
    user = User(
        email=f"testuser_{uuid.uuid4()}@example.com",
        full_name="Test User",
        hashed_password="hashed_password",
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# Helper function to create a prerequisite contact
async def create_test_contact(db: AsyncSession, user_id: uuid.UUID) -> Contact:
    """Creates a dummy contact for testing."""
    contact = Contact(
        name="Test Contact",
        level=ContactLevel.DIRECT_MANAGER,
        user_id=user_id
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact

@pytest.mark.asyncio
async def test_interaction_logging_flow(client: AsyncClient, db_session: AsyncSession):
    """
    Test the full API user flow for logging an interaction with tactics.
    """
    # 1. Setup: Manually seed tactics and create a user and contact in the DB.
    # The get_current_user dependency is mocked to return this user.
    for tactic_data in SEED_TACTICS:
        db_session.add(RapportTactic(**tactic_data))
    await db_session.commit()

    user = await create_test_user(db_session)
    contact = await create_test_contact(db_session, user_id=user.id)

    # 2. Fetch available rapport tactics via API
    response = await client.get("/api/v1/rapport/tactics")
    assert response.status_code == 200
    tactics = response.json()
    assert len(tactics) > 2

    # 3. Log a new interaction with tactics via API
    interaction_payload = {
        "interaction": {
            "contact_id": str(contact.id),
            "interaction_datetime": datetime.now(timezone.utc).isoformat(),
            "medium": "Video Call",
            "topic": "API Flow Test",
            "rapport_score_post": 9,
        },
        "tactic_logs": [
            {"tactic_id": tactics[0]['id'], "effectiveness_score": 5},
            {"tactic_id": tactics[1]['id'], "effectiveness_score": 4},
        ]
    }

    response = await client.post("/api/v1/interactions/", json=interaction_payload)

    # 4. Assertions
    assert response.status_code == 201
    created_interaction = response.json()
    assert created_interaction["topic"] == "API Flow Test"
    assert created_interaction["contact_id"] == str(contact.id)

    # 5. Verify the interaction and its tactics were saved correctly
    get_response = await client.get(f"/api/v1/interactions/?contact_id={contact.id}")
    assert get_response.status_code == 200
    interactions_list = get_response.json()
    assert len(interactions_list) == 1
    assert interactions_list[0]["id"] == created_interaction["id"]