import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from .base import CoreRead
from .rapport import InteractionTacticLogBase, InteractionTacticLogCreate


# New schema for reading tactic log drafts
class InteractionTacticLogDraftRead(InteractionTacticLogBase, CoreRead):
    """Schema for reading a tactic log that is part of a draft."""
    # This schema correctly represents a draft log, which has its own ID
    # but does not yet have a final interaction_id.
    pass


# Base Schemas
class InteractionDraftBase(BaseModel):
    contact_id: uuid.UUID | None = None
    interaction_datetime: datetime | None = None
    medium: str | None = None
    topic: str | None = None
    rapport_score_post: int | None = Field(None, ge=1, le=10)
    observed_non_verbal: str | None = None
    user_notes: str | None = None


# Schemas for API Operations
class InteractionDraftCreate(BaseModel):
    """Schema to start a new draft, optionally with the first step."""
    contact_id: uuid.UUID | None = None


class InteractionDraftUpdate(InteractionDraftBase):
    """Schema for generic updates, though specific step schemas are preferred."""
    pass


class InteractionDraftRead(InteractionDraftBase):
    """Full representation of an interaction draft, including its nested tactic logs."""
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    # Use the new, correct schema for reading tactic log drafts
    tactic_log_drafts: List[InteractionTacticLogDraftRead] = []

    class Config:
        from_attributes = True


# Schemas for Guided Flow Steps
class InteractionDraftStep1Contact(BaseModel):
    """Step 1: Select the contact for the interaction."""
    contact_id: uuid.UUID


class InteractionDraftStep2Details(BaseModel):
    """Step 2: Provide the core details of the interaction."""
    interaction_datetime: datetime
    medium: str = Field(..., max_length=100)
    topic: str = Field(..., max_length=255)
    rapport_score_post: int = Field(..., ge=1, le=10)
    observed_non_verbal: str | None = None
    user_notes: str | None = None


class InteractionDraftStep3Tactic(InteractionTacticLogCreate):
    """Step 3: Add a single rapport-building tactic used during the interaction."""
    pass