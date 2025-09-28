import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
import uuid

from src.collaboration_bridge.models import (
    User,
    Contact,
    RapportTactic,
    Interaction,
    InteractionDraft,
    ContactLevel,
    ScientificDomain,
)

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    user = User(
        email="testuser@example.com",
        full_name="Test User",
        hashed_password="fake_password",
        is_active=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
async def test_contact(db_session: AsyncSession, test_user: User) -> Contact:
    contact = Contact(
        name="Test Contact",
        title="Manager",
        level=ContactLevel.DIRECT_MANAGER,
        user_id=test_user.id,
    )
    db_session.add(contact)
    await db_session.commit()
    await db_session.refresh(contact)
    return contact


@pytest.fixture
async def test_tactic(db_session: AsyncSession) -> RapportTactic:
    tactic = RapportTactic(
        name="Active Listening",
        domain=ScientificDomain.COMMUNICATION,
        description="Listen actively.",
    )
    db_session.add(tactic)
    await db_session.commit()
    await db_session.refresh(tactic)
    return tactic


async def test_guided_interaction_flow(
    client: AsyncClient,
    db_session: AsyncSession,
    test_user: User,
    test_contact: Contact,
    test_tactic: RapportTactic,
):
    """
    Tests the entire guided interaction flow from start to finish.
    """
    # Because of the placeholder auth, we don't need headers.
    # The `get_current_user` dependency will pick up `test_user`.

    # Step 1: Start the guided interaction
    start_response = await client.post(
        "/api/v1/guided-interactions/start",
        json={"contact_id": str(test_contact.id)},
    )
    assert start_response.status_code == 201
    draft_data = start_response.json()
    draft_id = draft_data["id"]
    assert draft_data["contact_id"] == str(test_contact.id)

    # Step 2: Add details to the draft
    details_payload = {
        "interaction_datetime": datetime.now(timezone.utc).isoformat(),
            "medium": "Video Call",
        "topic": "Weekly Sync",
        "rapport_score_post": 9,
        "user_notes": "It went well.",
    }
    details_response = await client.patch(
        f"/api/v1/guided-interactions/{draft_id}/details",
        json=details_payload,
    )
    assert details_response.status_code == 200
    assert details_response.json()["topic"] == "Weekly Sync"

    # Step 3: Add a tactic to the draft
    tactic_payload = {
        "tactic_id": str(test_tactic.id),
        "effectiveness_score": 5,
        "notes": "Used active listening.",
    }
    tactic_response = await client.post(
        f"/api/v1/guided-interactions/{draft_id}/tactics",
        json=tactic_payload,
    )
    assert tactic_response.status_code == 200
    assert len(tactic_response.json()["tactic_log_drafts"]) == 1

    # Step 4: Finalize the interaction
    finish_response = await client.post(
        f"/api/v1/guided-interactions/{draft_id}/finish"
    )
    assert finish_response.status_code == 200
    final_interaction_data = finish_response.json()

    # Verify the final interaction
    assert final_interaction_data["topic"] == "Weekly Sync"
    assert len(final_interaction_data["tactic_logs"]) == 1
    assert final_interaction_data["tactic_logs"][0]["tactic_id"] == str(test_tactic.id)

    # Verify the draft was deleted by ensuring it's no longer accessible via the API
    verify_delete_response = await client.patch(
        f"/api/v1/guided-interactions/{draft_id}/details",
        json=details_payload,
    )
    assert verify_delete_response.status_code == 404

    # Verify the final interaction was created in the database
    interaction = await db_session.get(Interaction, uuid.UUID(final_interaction_data["id"]))
    assert interaction is not None
    assert interaction.topic == "Weekly Sync"
    assert interaction.user_id == test_user.id