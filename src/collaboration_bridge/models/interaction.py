import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from collaboration_bridge.core.database import Base
from collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from collaboration_bridge.models.rapport import InteractionTacticLog

class InteractionMedium(str, Enum):
    """The medium through which the interaction took place."""
    IN_PERSON = "In-person"
    VIDEO_CALL = "Video Call"
    VOICE_CALL = "Voice Call"
    EMAIL_CHAT = "Email/Chat"

class Interaction(Base, TimestampMixin, SoftDeleteMixin):
    """
    Logs a specific interaction (meeting, call, etc.).
    """
    __tablename__ = "interactions"

    user_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("users.id"), nullable=False)
    contact_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("contacts.id"), nullable=False)

    interaction_datetime: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
    medium: Mapped[InteractionMedium] = mapped_column(sa.Enum(InteractionMedium), nullable=False)

    topic: Mapped[str] = mapped_column(sa.String(500), nullable=False)
    user_notes: Mapped[str] = mapped_column(sa.Text, nullable=True)

    # Psychological Tracking Fields

    # Subjective rating (1-10) of the rapport established
    rapport_score_post: Mapped[int] = mapped_column(sa.Integer, nullable=False)

    # Notes on observed non-verbal cues (Crucial for rapport assessment)
    observed_non_verbal: Mapped[str] = mapped_column(
        sa.Text, nullable=True,
        comment="e.g., Open posture, genuine (Duchenne) smile, eye contact, tone."
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="interactions")
    contact: Mapped["Contact"] = relationship("Contact", back_populates="interactions")

    # Techniques used during the interaction (Many-to-Many via Association Object)
    tactic_logs: Mapped[List["InteractionTacticLog"]] = relationship(back_populates="interaction")
