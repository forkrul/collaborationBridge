import uuid
from enum import Enum
from typing import List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from collaboration_bridge.core.database import Base
from collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin


class ContactLevel(str, Enum):
    """Defines the organizational relationship of the contact to the user."""
    DIRECT_MANAGER = "Direct Manager"
    SKIP_LEVEL = "Skip-Level Manager"
    SENIOR_LEADER = "Senior Leadership"
    MENTOR = "Mentor"

class Contact(Base, TimestampMixin, SoftDeleteMixin):
    """
    Represents a person the user interacts with (e.g., manager, skip-level).
    """
    __tablename__ = "contacts"

    user_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("users.id"), nullable=False)

    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    title: Mapped[str] = mapped_column(sa.String(255), nullable=True)
    level: Mapped[ContactLevel] = mapped_column(sa.Enum(ContactLevel), nullable=False)

    # Fields for tracking behavioral science aspects:

    # Cialdini's Liking (Similarity): shared interests, background, values.
    common_ground_notes: Mapped[str] = mapped_column(sa.Text, nullable=True)

    # Notes for adapting communication (Mirroring/Pacing)
    communication_style_notes: Mapped[str] = mapped_column(
        sa.Text, nullable=True,
        comment="e.g., Prefers direct/data-driven, fast-paced, high/low context."
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="contacts")
    interactions: Mapped[List["Interaction"]] = relationship(back_populates="contact")
