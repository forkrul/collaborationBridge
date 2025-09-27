"""Enhanced mixins for database models with production-ready features.

This module provides SQLAlchemy mixins with comprehensive functionality including:
- Timestamp tracking with timezone support
- Enhanced soft delete with audit trail
- Query filtering utilities
- Restoration capabilities

The implementation follows PEP 8, PEP 257, and PEP 484 standards for
code quality, documentation, and type safety.
"""

from datetime import datetime
from typing import Any, Optional
import sqlalchemy as sa
from sqlalchemy import Boolean, String, Text, event
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import mapped_column, Mapped, Query, Session
from sqlalchemy.sql import functions

class TimestampMixin:
    """Enhanced mixin for adding comprehensive timestamp tracking.

    This mixin provides automatic timestamp management with timezone support
    for all database operations including creation and updates.

    Attributes:
        created_at: Timestamp when the record was created (timezone-aware).
        updated_at: Timestamp when the record was last updated (timezone-aware).

    Example:
        class User(Base, TimestampMixin):
            __tablename__ = 'users'
            name = mapped_column(String(100))

        # Timestamps are automatically managed
        user = User(name="John Doe")
        # created_at and updated_at are set automatically
    """

    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        """Timestamp when the record was created.

        Returns:
            Mapped[datetime]: DateTime column with timezone support and automatic default.
        """
        return mapped_column(
            sa.DateTime(timezone=True),
            server_default=functions.now(),
            nullable=False,
            index=True,
            doc="Timestamp when the record was created (timezone-aware)",
        )

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        """Timestamp when the record was last updated.

        Returns:
            Mapped[datetime]: DateTime column with timezone support and automatic updates.
        """
        return mapped_column(
            sa.DateTime(timezone=True),
            server_default=functions.now(),
            onupdate=functions.now(),
            nullable=False,
            index=True,
            doc="Timestamp when the record was last updated (timezone-aware)",
        )

class SoftDeleteMixin:
    """Enhanced mixin for adding production-ready soft delete functionality.

    This mixin provides comprehensive soft delete capabilities including:
    - Timestamp tracking for deletion and restoration
    - Audit trail with user/system identification
    - Optional deletion reason tracking
    - Query filtering utilities

    Attributes:
        deleted_at: Timestamp when the record was soft deleted (timezone-aware).
        deleted_by: Identifier of user/system that performed the deletion.
        deletion_reason: Optional reason for the deletion.
        is_deleted: Boolean flag for quick filtering (indexed).

    Example:
        class User(Base, SoftDeleteMixin):
            __tablename__ = 'users'
            name = mapped_column(String(100))

        # Usage
        user = User(name="John Doe")
        user.soft_delete(deleted_by="admin", reason="Account inactive")

        # Check if deleted
        if user.is_soft_deleted:
            user.restore()
    """

    @declared_attr
    def deleted_at(cls) -> Mapped[Optional[datetime]]:
        """Timestamp when the record was soft deleted.

        Returns:
            Mapped[Optional[datetime]]: DateTime column with timezone support, indexed for performance.
        """
        return mapped_column(
            sa.DateTime(timezone=True),
            nullable=True,
            index=True,
            doc="Timestamp when the record was soft deleted (timezone-aware)",
        )

    @declared_attr
    def deleted_by(cls) -> Mapped[Optional[str]]:
        """Identifier of user/system that performed the deletion.

        Returns:
            Mapped[Optional[str]]: String column for audit trail.
        """
        return mapped_column(
            String(255),
            nullable=True,
            index=True,
            doc="Identifier of user/system that performed the deletion",
        )

    @declared_attr
    def deletion_reason(cls) -> Mapped[Optional[str]]:
        """Optional reason for the deletion.

        Returns:
            Mapped[Optional[str]]: Text column for deletion reason.
        """
        return mapped_column(
            Text,
            nullable=True,
            doc="Optional reason for the deletion",
        )

    @declared_attr
    def is_deleted(cls) -> Mapped[bool]:
        """Boolean flag for quick filtering of deleted records.

        Returns:
            Mapped[bool]: Boolean column with index for performance.
        """
        return mapped_column(
            Boolean,
            default=False,
            nullable=False,
            index=True,
            doc="Boolean flag indicating if the record is soft deleted",
        )

    def soft_delete(
        self,
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None,
    ) -> None:
        """Mark the record as soft deleted with audit information.

        Args:
            deleted_by: Identifier of user/system performing the deletion.
            reason: Optional reason for the deletion.

        Example:
            user.soft_delete(deleted_by="admin", reason="Account cleanup")
        """
        self.deleted_at = datetime.now()
        self.deleted_by = deleted_by
        self.deletion_reason = reason
        self.is_deleted = True

    def restore(self, restored_by: Optional[str] = None) -> None:
        """Restore a soft-deleted record.

        Args:
            restored_by: Identifier of user/system performing the restoration.

        Example:
            user.restore(restored_by="admin")
        """
        self.deleted_at = None
        self.deleted_by = None
        self.deletion_reason = None
        self.is_deleted = False

    @property
    def is_soft_deleted(self) -> bool:
        """Check if the record is currently soft deleted.

        Returns:
            bool: True if the record is soft deleted, False otherwise.
        """
        return self.is_deleted and self.deleted_at is not None

    @classmethod
    def get_active_filter(cls) -> Any:
        """Get SQLAlchemy filter for active (non-deleted) records.

        Returns:
            SQLAlchemy filter expression for active records.

        Example:
            query = session.query(User).filter(User.get_active_filter())
        """
        return cls.is_deleted.is_(False)

    @classmethod
    def get_deleted_filter(cls) -> Any:
        """Get SQLAlchemy filter for soft-deleted records.

        Returns:
            SQLAlchemy filter expression for deleted records.

        Example:
            query = session.query(User).filter(User.get_deleted_filter())
        """
        return cls.is_deleted.is_(True)