import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base Pydantic schema configuration."""
    # Enables ORM mode (reading data directly from SQLAlchemy models)
    # 'extra="forbid"' enhances security by rejecting unexpected fields.
    model_config = ConfigDict(from_attributes=True, extra="forbid")

class CoreRead(BaseSchema):
    """Schema for core attributes returned in read operations."""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
