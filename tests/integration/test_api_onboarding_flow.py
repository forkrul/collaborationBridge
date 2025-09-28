import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
import uuid

from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.models.onboarding import OnboardingStep


# Helper to create a user, re-used from other tests
async def create_test_user(db: AsyncSession) -> User:
    """Creates a dummy user for testing."""
    user = User(
        email=f"onboarding_user_{uuid.uuid4()}@example.com",
        full_name="Onboarding Test User",
        hashed_password="secure_password",
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@pytest.mark.asyncio
async def test_onboarding_flow_success_path(client: AsyncClient, db_session: AsyncSession):
    """
    Tests the full, successful user journey through the onboarding API flow.
    This test also implicitly covers error handling for missing prerequisites.
    """
    # Setup: Create a user in the database so the placeholder `get_current_user`
    # dependency can find them.
    await create_test_user(db_session)

    # Step 1: Get initial status. Should be 'welcome'.
    response = await client.get("/api/v1/onboarding/")
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["current_step"] == OnboardingStep.WELCOME.value
    assert not onboarding_status["is_complete"]

    # Step 2: Advance from 'welcome' to 'contact_added'.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["current_step"] == OnboardingStep.CONTACT_ADDED.value

    # Step 3: Try to advance without creating a contact. Should fail.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 400
    assert "add at least one contact" in response.json()["detail"]

    # Step 4: Create a contact.
    contact_payload = {
        "name": "Test Manager",
        "title": "Director of Testing",
        "level": "Direct Manager"
    }
    response = await client.post("/api/v1/contacts/", json=contact_payload)
    assert response.status_code == 201
    contact = response.json()

    # Step 5: Advance from 'contact_added' to 'interaction_logged'. Should succeed now.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["current_step"] == OnboardingStep.INTERACTION_LOGGED.value

    # Step 6: Try to advance without logging an interaction. Should fail.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 400
    assert "log at least one interaction" in response.json()["detail"]

    # Step 7: Log an interaction.
    interaction_payload = {
        "interaction": {
            "contact_id": contact["id"],
            "interaction_datetime": datetime.now(timezone.utc).isoformat(),
                "medium": "Email/Chat",
            "topic": "Onboarding Test Interaction",
            "rapport_score_post": 7,
        },
            "tactic_logs": []  # No tactics needed for this test
    }
    response = await client.post("/api/v1/interactions/", json=interaction_payload)
    assert response.status_code == 201

    # Step 8: Advance from 'interaction_logged' to 'completed'. Should succeed.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["current_step"] == OnboardingStep.COMPLETED.value
    assert onboarding_status["is_complete"]

    # Step 9: Try to advance again. Should remain 'completed'.
    response = await client.post("/api/v1/onboarding/next")
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["current_step"] == OnboardingStep.COMPLETED.value
    assert onboarding_status["is_complete"]