import uuid
from datetime import datetime
from typing import List

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.collaboration_bridge.core.database import Base
from src.collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin


class InteractionDraft(Base, TimestampMixin, SoftDeleteMixin):
    """
    Represents a draft of an interaction that is being created through a multi-step flow.
    This allows for persisting the state of the interaction creation process across multiple
    API requests without creating an incomplete Interaction record.
    """

    __tablename__ = "interaction_drafts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="started", index=True
    )

    # Step 1: Contact selection
    contact_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("contacts.id"), index=True
    )

    # Step 2: Interaction details
    interaction_datetime: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    medium: Mapped[str | None] = mapped_column(String(100))
    topic: Mapped[str | None] = mapped_column(String(255))
    rapport_score_post: Mapped[int | None]
    observed_non_verbal: Mapped[str | None] = mapped_column(Text)
    user_notes: Mapped[str | None] = mapped_column(Text)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="interaction_drafts")
    contact: Mapped["Contact"] = relationship()
    tactic_log_drafts: Mapped[List["InteractionTacticLogDraft"]] = relationship(
        back_populates="interaction_draft",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class InteractionTacticLogDraft(Base, TimestampMixin):
    """
    Represents a rapport-building tactic that is part of a draft interaction.
    """

    __tablename__ = "interaction_tactic_log_drafts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    interaction_draft_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interaction_drafts.id", ondelete="CASCADE"),
        index=True,
    )
    tactic_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("rapport_tactics.id"), index=True
    )
    effectiveness_score: Mapped[int]
    notes: Mapped[str | None] = mapped_column(Text)

    # Relationships
    interaction_draft: Mapped["InteractionDraft"] = relationship(
        back_populates="tactic_log_drafts"
    )
    tactic: Mapped["RapportTactic"] = relationship()