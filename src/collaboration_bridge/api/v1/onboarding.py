from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.api import deps
from src.collaboration_bridge.core.database import get_db_session
from src.collaboration_bridge.crud.contact import contact_crud
from src.collaboration_bridge.crud.interaction import interaction_crud
from src.collaboration_bridge.crud.onboarding import onboarding_crud
from src.collaboration_bridge.models.onboarding import OnboardingStep
from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.schemas.onboarding import OnboardingRead, OnboardingUpdate

router = APIRouter()


@router.get("/", response_model=OnboardingRead)
async def get_onboarding_status(
    *,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> OnboardingRead:
    """
    Get the current user's onboarding status.
    If no status exists, it will be created automatically.
    """
    onboarding_progress = await onboarding_crud.get_or_create_by_user(
        db=db, user_id=current_user.id
    )
    return onboarding_progress


@router.post("/next", response_model=OnboardingRead)
async def advance_onboarding_step(
    *,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(deps.get_current_user),
) -> OnboardingRead:
    """
    Advance the user to the next step in the onboarding process.
    This endpoint acts as a state machine, validating prerequisites for each step.
    """
    onboarding = await onboarding_crud.get_or_create_by_user(
        db=db, user_id=current_user.id
    )

    if onboarding.is_complete:
        return onboarding  # Already finished

    next_step = onboarding.current_step
    update_data = OnboardingUpdate()

    if onboarding.current_step == OnboardingStep.WELCOME:
        next_step = OnboardingStep.CONTACT_ADDED

    elif onboarding.current_step == OnboardingStep.CONTACT_ADDED:
        # Prerequisite: User must have at least one contact
        contacts = await contact_crud.get_multi_by_user(db=db, user_id=current_user.id, limit=1)
        if not contacts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must add at least one contact to proceed.",
            )
        next_step = OnboardingStep.INTERACTION_LOGGED

    elif onboarding.current_step == OnboardingStep.INTERACTION_LOGGED:
        # Prerequisite: User must have logged at least one interaction
        interactions = await interaction_crud.get_multi_by_user(db=db, user_id=current_user.id, limit=1)
        if not interactions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must log at least one interaction to complete onboarding.",
            )
        next_step = OnboardingStep.COMPLETED
        update_data.is_complete = True

    update_data.current_step = next_step
    updated_onboarding = await onboarding_crud.update(
        db=db, db_obj=onboarding, obj_in=update_data
    )
    return updated_onboarding