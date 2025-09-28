import uuid
from enum import Enum

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.collaboration_bridge.core.database import Base
from src.collaboration_bridge.core.mixins import TimestampMixin


class OnboardingStep(str, Enum):
    """Defines the steps in the user onboarding flow."""
    WELCOME = "welcome"
    CONTACT_ADDED = "contact_added"
    INTERACTION_LOGGED = "interaction_logged"
    COMPLETED = "completed"


class Onboarding(Base, TimestampMixin):
    """
    Tracks a user's progress through the first-time onboarding flow.
    """
    __tablename__ = "onboarding_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        sa.ForeignKey("users.id"), nullable=False, unique=True
    )
    current_step: Mapped[OnboardingStep] = mapped_column(
        sa.Enum(OnboardingStep),
        nullable=False,
        default=OnboardingStep.WELCOME,
    )
    is_complete: Mapped[bool] = mapped_column(
        sa.Boolean, nullable=False, default=False
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="onboarding_progress")