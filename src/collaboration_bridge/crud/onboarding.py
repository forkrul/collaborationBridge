import uuid
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.collaboration_bridge.crud.base import CRUDBase
from src.collaboration_bridge.models.onboarding import Onboarding, OnboardingStep
from src.collaboration_bridge.schemas.onboarding import OnboardingUpdate


class CRUDOnboarding(CRUDBase[Onboarding, None, OnboardingUpdate]):
    """
    CRUD operations for Onboarding progress, scoped to the user.
    A user can only have one onboarding record.
    """

    async def get_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID
    ) -> Optional[Onboarding]:
        """Get the onboarding record for a specific user."""
        query = select(self.model).where(self.model.user_id == user_id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_or_create_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID
    ) -> Onboarding:
        """
        Get the onboarding record for a user. If it doesn't exist, create it.
        """
        onboarding_record = await self.get_by_user(db=db, user_id=user_id)
        if not onboarding_record:
            # Create a new record with default values
            onboarding_data = {
                "user_id": user_id,
                "current_step": OnboardingStep.WELCOME,
                "is_complete": False,
            }
            onboarding_record = await self.create(db=db, obj_in=onboarding_data)
        return onboarding_record


# Instantiate the CRUD class for use in the API layer
onboarding_crud = CRUDOnboarding(Onboarding)