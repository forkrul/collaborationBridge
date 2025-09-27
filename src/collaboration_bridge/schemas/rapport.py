import uuid
from typing import Optional

from pydantic import Field

from src.collaboration_bridge.models.rapport import ScientificDomain
from src.collaboration_bridge.schemas.base import BaseSchema, CoreRead


# Schemas for RapportTactic
class RapportTacticBase(BaseSchema):
    """Base schema for RapportTactic data."""
    name: str = Field(..., max_length=150)
    description: str
    domain: ScientificDomain

class RapportTacticRead(RapportTacticBase, CoreRead):
    """Schema for reading RapportTactic data."""
    pass

# Schemas for InteractionTacticLog
class InteractionTacticLogBase(BaseSchema):
    """Base schema for logging a tactic in an interaction."""
    tactic_id: uuid.UUID = Field(..., description="The ID of the rapport tactic used.")
    effectiveness_score: int = Field(..., ge=1, le=5, description="Effectiveness rating (1-5).")
    notes: Optional[str] = Field(None, description="Notes on how the tactic was applied.")

class InteractionTacticLogCreate(InteractionTacticLogBase):
    """Schema for logging a tactic during interaction creation."""
    pass

class InteractionTacticLogRead(InteractionTacticLogBase, CoreRead):
    """Schema for reading a logged tactic."""
    interaction_id: uuid.UUID
