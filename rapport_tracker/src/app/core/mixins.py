from datetime import datetime
from typing import Optional
import sqlalchemy as sa
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import functions

class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps.
    Uses database functions for generation.
    """
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=functions.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True), server_default=functions.now(),
        onupdate=functions.now(), nullable=False
    )

class SoftDeleteMixin:
    """
    Mixin to enable soft deletes by flagging records with deleted_at.

    Filtering soft-deleted records must be handled in the CRUD layer
    (e.g., .where(Model.deleted_at.is_(None))).
    """
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        sa.DateTime(timezone=True), nullable=True, index=True
    )

    def soft_delete(self) -> None:
        """
        Marks the record as deleted. Must be followed by a session commit.
        We rely on the database function now() here for consistency if used within a transaction.
        """
        self.deleted_at = functions.now()

    def restore(self) -> None:
        """Restores a soft-deleted record."""
        self.deleted_at = None