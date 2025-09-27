from pydantic import Field
from typing import Optional
from src.collaboration_bridge.schemas.base import BaseSchema, CoreRead
from src.collaboration_bridge.models.contact import ContactLevel

class ContactBase(BaseSchema):
    """Base schema for Contact data."""
    name: str = Field(..., max_length=255, description="Full name of the contact.")
    title: Optional[str] = Field(None, max_length=255, description="Job title.")
    level: ContactLevel = Field(..., description="Organizational relationship.")

    # Science-backed fields
    common_ground_notes: Optional[str] = Field(None, description="Notes on shared interests or values (Similarity principle).")
    communication_style_notes: Optional[str] = Field(None, description="Observed communication preferences (for mirroring/pacing).")

class ContactCreate(ContactBase):
    """Schema for creating a new Contact."""
    pass

class ContactUpdate(BaseSchema):
    """Schema for updating a Contact (partial updates/PATCH)."""
    name: Optional[str] = Field(None, max_length=255)
    title: Optional[str] = Field(None, max_length=255)
    level: Optional[ContactLevel] = None
    common_ground_notes: Optional[str] = None
    communication_style_notes: Optional[str] = None

class ContactRead(ContactBase, CoreRead):
    """Schema for reading Contact data."""
    pass