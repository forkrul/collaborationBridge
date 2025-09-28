from enum import Enum
from pydantic import BaseModel, Field

class OnboardingStatus(str, Enum):
    """
    Enum for user onboarding status.
    """
    NOT_STARTED = "not_started"
    PROFILE_COMPLETE = "profile_complete"
    FIRST_CONTACT_ADDED = "first_contact_added"
    FIRST_INTERACTION_LOGGED = "first_interaction_logged"
    COMPLETED = "completed"


class OnboardingStep(BaseModel):
    """
    Schema for representing the current state of the onboarding process.
    """
    status: OnboardingStatus = Field(..., description="The current onboarding status for the user.")
    next_step: str | None = Field(None, description="A hint for the next action the user should take.")
    is_complete: bool = Field(..., description="Indicates whether the user has completed the entire onboarding flow.")

    class Config:
        use_enum_values = True
        orm_mode = True