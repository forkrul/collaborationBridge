from fastapi import APIRouter, Depends

from src.collaboration_bridge.api import deps
from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.schemas.onboarding import OnboardingStep
from src.collaboration_bridge.services.onboarding import OnboardingService

router = APIRouter()


from sqlalchemy.ext.asyncio import AsyncSession


@router.get("/status", response_model=OnboardingStep)
async def get_onboarding_status(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> OnboardingStep:
    """
    Get the current onboarding status for the authenticated user.

    This endpoint returns the user's current position in the onboarding flow,
    a message suggesting the next action, and a flag indicating if the flow is complete.

    It also automatically transitions the user to the `COMPLETED` status if they
    have just logged their first interaction.
    """
    onboarding_service = OnboardingService(user=current_user, db=db)
    return await onboarding_service.get_onboarding_step()