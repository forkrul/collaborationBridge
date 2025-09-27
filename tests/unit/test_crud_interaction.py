import pytest
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime, timezone

from src.collaboration_bridge.crud.interaction import interaction_crud
from src.collaboration_bridge.schemas.interaction import InteractionCreate
from src.collaboration_bridge.schemas.rapport import InteractionTacticLogCreate
from src.collaboration_bridge.models.contact import Contact, ContactLevel
from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.models.interaction import InteractionMedium
from src.collaboration_bridge.models.rapport import RapportTactic
from src.collaboration_bridge.core.seed_data import SEED_TACTICS

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
async def test_create_interaction_with_tactics(db_session: AsyncSession) -> None:
    """Test creating an interaction along with its associated tactic logs."""
    # 1. Setup: Manually create tactics, a user, and a contact
    tactics = []
    for tactic_data in SEED_TACTICS:
        tactic = RapportTactic(**tactic_data)
        db_session.add(tactic)
        tactics.append(tactic)
    await db_session.commit()

    user = await create_test_user(db_session)
    contact = await create_test_contact(db_session, user_id=user.id)
    assert len(tactics) > 1

    # 2. Prepare the input data
    interaction_data = InteractionCreate(
        contact_id=contact.id,
        interaction_datetime=datetime.now(timezone.utc),
        medium=InteractionMedium.VIDEO_CALL,
        topic="Project Update",
        rapport_score_post=8
    )
    tactic_logs_data = [
        InteractionTacticLogCreate(tactic_id=tactics[0].id, effectiveness_score=5),
        InteractionTacticLogCreate(tactic_id=tactics[1].id, effectiveness_score=4, notes="Worked well"),
    ]

    # 3. Call the CRUD method
    interaction = await interaction_crud.create_with_tactics(
        db=db_session,
        obj_in=interaction_data,
        user_id=user.id,
        tactic_logs_in=tactic_logs_data
    )

    # 4. Assertions
    assert interaction is not None
    assert interaction.topic == "Project Update"
    assert interaction.user_id == user.id
    assert interaction.contact_id == contact.id

    await db_session.refresh(interaction, attribute_names=["tactic_logs"])

    assert len(interaction.tactic_logs) == 2

    logged_tactic_ids = sorted([log.tactic_id for log in interaction.tactic_logs])
    expected_tactic_ids = sorted([tactics[0].id, tactics[1].id])
    assert logged_tactic_ids == expected_tactic_ids