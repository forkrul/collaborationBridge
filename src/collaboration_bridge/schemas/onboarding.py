from typing import Optional

from pydantic import Field

from src.collaboration_bridge.models.onboarding import OnboardingStep
from src.collaboration_bridge.schemas.base import BaseSchema, CoreRead


class OnboardingBase(BaseSchema):
    """Base schema for Onboarding data."""
    current_step: OnboardingStep = Field(
        ..., description="The user's current step in the onboarding flow."
    )
    is_complete: bool = Field(
        ..., description="Indicates if the user has completed the entire flow."
    )


class OnboardingRead(OnboardingBase, CoreRead):
    """Schema for reading Onboarding progress."""
    pass


class OnboardingUpdate(BaseSchema):
    """Schema for updating a user's onboarding progress."""
    current_step: Optional[OnboardingStep] = None
    is_complete: Optional[bool] = None