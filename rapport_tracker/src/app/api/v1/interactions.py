from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
import uuid

from src.app.schemas.interaction import InteractionCreate, InteractionRead
from src.app.schemas.rapport import InteractionTacticLogCreate
from src.app.crud.interaction import interaction_crud
from src.app.crud.contact import contact_crud
from src.app.api import deps
from src.app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from src.app.core.database import get_db_session

router = APIRouter()

class InteractionWithTacticsCreate(BaseModel):
    """
    A special schema to handle the creation of an interaction
    and its associated tactic logs in a single API call.
    """
    interaction: InteractionCreate
    tactic_logs: List[InteractionTacticLogCreate] = []

@router.post("/", response_model=InteractionRead, status_code=status.HTTP_201_CREATED)
async def create_interaction_with_tactics(
    *,
    db: AsyncSession = Depends(get_db_session),
    interaction_in: InteractionWithTacticsCreate,
    current_user: User = Depends(deps.get_current_user),
) -> InteractionRead:
    """
    Log a new interaction with a contact, including the rapport-building tactics used.
    """
    # First, verify that the contact exists and belongs to the current user.
    contact = await contact_crud.get_by_user(
        db=db, user_id=current_user.id, contact_id=interaction_in.interaction.contact_id
    )
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found. You can only log interactions with your own contacts.",
        )

    # Now, create the interaction and its associated logs in a single transaction.
    interaction = await interaction_crud.create_with_tactics(
        db=db,
        obj_in=interaction_in.interaction,
        user_id=current_user.id,
        tactic_logs_in=interaction_in.tactic_logs
    )
    return interaction

@router.get("/", response_model=List[InteractionRead])
async def read_interactions_for_contact(
    contact_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> List[InteractionRead]:
    """
    Retrieve all interactions for a specific contact belonging to the current user.
    """
    # Verify the contact exists and belongs to the user
    contact = await contact_crud.get_by_user(
        db=db, user_id=current_user.id, contact_id=contact_id
    )
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found.",
        )

    interactions = await interaction_crud.get_multi_by_user_and_contact(
        db=db, user_id=current_user.id, contact_id=contact_id, skip=skip, limit=limit
    )
    return interactions