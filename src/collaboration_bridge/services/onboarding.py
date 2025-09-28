from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.models.user import User
from src.collaboration_bridge.schemas.onboarding import OnboardingStatus, OnboardingStep


class OnboardingService:
    """
    Service to manage the user onboarding flow.
    """

    def __init__(self, user: User, db: AsyncSession):
        self.user = user
        self.db = db

    async def get_onboarding_step(self) -> OnboardingStep:
        """
        Determines the user's current onboarding step and provides guidance for the next action.
        If the user has just logged their first interaction, it automatically transitions them to 'completed'.
        """
        # If the user has logged their first interaction, complete the onboarding
        if self.user.onboarding_status == OnboardingStatus.FIRST_INTERACTION_LOGGED:
            self.user.onboarding_status = OnboardingStatus.COMPLETED
            self.db.add(self.user)
            await self.db.commit()
            await self.db.refresh(self.user)

        status = self.user.onboarding_status
        is_complete = status == OnboardingStatus.COMPLETED
        next_step_message = None

        if status == OnboardingStatus.NOT_STARTED:
            next_step_message = "Welcome! The first step is to add your first manager as a contact."
        elif status == OnboardingStatus.PROFILE_COMPLETE:
            next_step_message = "Great! Now, add your first manager as a contact to begin tracking interactions."
        elif status == OnboardingStatus.FIRST_CONTACT_ADDED:
            next_step_message = "Excellent! Your first contact is added. Now, log your first interaction with them."
        elif status == OnboardingStatus.COMPLETED:
            next_step_message = "You have completed the onboarding process. Keep up the great work!"

        return OnboardingStep(
            status=status,
            next_step=next_step_message,
            is_complete=is_complete,
        )