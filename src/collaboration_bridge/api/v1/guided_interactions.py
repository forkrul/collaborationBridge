import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.api import deps
from src.collaboration_bridge.core.database import get_db_session
from src.collaboration_bridge.crud import (
    contact_crud,
    interaction_crud,
    interaction_draft_crud,
    rapport_tactic_crud,
)
from src.collaboration_bridge.models import Interaction, User
from src.collaboration_bridge.schemas import (
    InteractionCreate,
    InteractionDraftCreate,
    InteractionDraftRead,
    InteractionDraftStep1Contact,
    InteractionDraftStep2Details,
    InteractionDraftStep3Tactic,
    InteractionRead,
    InteractionTacticLogCreate,
)

router = APIRouter()


@router.post("/start", response_model=InteractionDraftRead, status_code=status.HTTP_201_CREATED)
async def start_guided_interaction(
    *,
    db: AsyncSession = Depends(get_db_session),
    draft_in: InteractionDraftCreate,
    current_user: User = Depends(deps.get_current_user),
) -> InteractionDraftRead:
    """Start a new guided interaction, creating a draft."""
    if draft_in.contact_id:
        contact = await contact_crud.get_by_user(db, user_id=current_user.id, contact_id=draft_in.contact_id)
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found.")

    draft = await interaction_draft_crud.create(db, obj_in={"user_id": current_user.id, **draft_in.model_dump()})
    return draft


@router.patch("/{draft_id}/contact", response_model=InteractionDraftRead)
async def set_interaction_contact(
    draft_id: uuid.UUID,
    contact_in: InteractionDraftStep1Contact,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> InteractionDraftRead:
    """Step 1: Set the contact for the interaction draft."""
    draft = await interaction_draft_crud.get_by_user(db, user_id=current_user.id, draft_id=draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Interaction draft not found.")

    contact = await contact_crud.get_by_user(db, user_id=current_user.id, contact_id=contact_in.contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found.")

    updated_draft = await interaction_draft_crud.update(db, db_obj=draft, obj_in=contact_in)
    return updated_draft


@router.patch("/{draft_id}/details", response_model=InteractionDraftRead)
async def set_interaction_details(
    draft_id: uuid.UUID,
    details_in: InteractionDraftStep2Details,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> InteractionDraftRead:
    """Step 2: Set the details for the interaction draft."""
    draft = await interaction_draft_crud.get_by_user(db, user_id=current_user.id, draft_id=draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Interaction draft not found.")
    if not draft.contact_id:
        raise HTTPException(status_code=400, detail="Contact must be set before adding details.")

    updated_draft = await interaction_draft_crud.update(db, db_obj=draft, obj_in=details_in)
    return updated_draft


@router.post("/{draft_id}/tactics", response_model=InteractionDraftRead)
async def add_interaction_tactic(
    draft_id: uuid.UUID,
    tactic_in: InteractionDraftStep3Tactic,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> InteractionDraftRead:
    """Step 3: Add a rapport tactic to the interaction draft."""
    draft = await interaction_draft_crud.get_by_user(db, user_id=current_user.id, draft_id=draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Interaction draft not found.")

    tactic = await rapport_tactic_crud.get(db, id=tactic_in.tactic_id)
    if not tactic:
        raise HTTPException(status_code=404, detail="Rapport tactic not found.")

    # This part needs custom implementation as CRUDBase doesn't handle nested creations.
    from src.collaboration_bridge.models import InteractionTacticLogDraft
    tactic_log_draft = InteractionTacticLogDraft(
        **tactic_in.model_dump(),
        interaction_draft_id=draft_id,
    )
    db.add(tactic_log_draft)
    await db.commit()
    # Eagerly load the relationship on the existing draft object to prevent serialization errors
    await db.refresh(draft, ["tactic_log_drafts"])
    return draft


@router.post("/{draft_id}/finish", response_model=InteractionRead)
async def finish_guided_interaction(
    draft_id: uuid.UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> Interaction:
    """Finalize the interaction, create the official record, and delete the draft."""
    draft = await interaction_draft_crud.get_by_user(db, user_id=current_user.id, draft_id=draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Interaction draft not found.")
    if not draft.contact_id or not draft.interaction_datetime or not draft.topic:
        raise HTTPException(status_code=400, detail="Incomplete interaction details.")

    from datetime import timezone

    # Ensure datetime is timezone-aware before final validation
    final_datetime = draft.interaction_datetime
    if final_datetime and final_datetime.tzinfo is None:
        final_datetime = final_datetime.replace(tzinfo=timezone.utc)

    interaction_data = InteractionCreate(
        contact_id=draft.contact_id,
        interaction_datetime=final_datetime,
        medium=draft.medium,
        topic=draft.topic,
        rapport_score_post=draft.rapport_score_post,
        observed_non_verbal=draft.observed_non_verbal,
        user_notes=draft.user_notes,
    )

    tactic_logs_data = [
        InteractionTacticLogCreate(
            tactic_id=log.tactic_id,
            effectiveness_score=log.effectiveness_score,
            notes=log.notes,
        )
        for log in draft.tactic_log_drafts
    ]

    interaction = await interaction_crud.create_with_tactics(
        db=db,
        obj_in=interaction_data,
        user_id=current_user.id,
        tactic_logs_in=tactic_logs_data,
    )

    await interaction_draft_crud.remove(db=db, db_obj=draft)

    return interaction