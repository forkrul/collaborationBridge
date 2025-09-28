import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import Field, field_validator

from src.collaboration_bridge.models.interaction import InteractionMedium
from src.collaboration_bridge.schemas.base import BaseSchema, CoreRead
from src.collaboration_bridge.schemas.rapport import InteractionTacticLogRead


class InteractionBase(BaseSchema):
    """Base schema for Interaction data."""
    interaction_datetime: datetime
    medium: InteractionMedium
    topic: str = Field(..., max_length=500)
    user_notes: Optional[str] = None

    # Science-backed fields
    rapport_score_post: int = Field(..., ge=1, le=10, description="Subjective rapport assessment (1-10).")
    observed_non_verbal: Optional[str] = None

class InteractionCreate(InteractionBase):
    """Schema for creating a new Interaction."""
    contact_id: uuid.UUID

    @field_validator('interaction_datetime')
    def check_datetime_is_timezone_aware(cls, v: datetime) -> datetime:
        """Ensures timestamps are timezone-aware for PostgreSQL consistency (TIMESTAMPTZ)."""
        if v.tzinfo is None:
            raise ValueError("Interaction datetime must be timezone-aware.")
        return v

class InteractionRead(InteractionBase, CoreRead):
    """Schema for reading Interaction data, including associated tactic logs."""
    contact_id: uuid.UUID
    tactic_logs: List[InteractionTacticLogRead] = []

    class Config:
        from_attributes = True