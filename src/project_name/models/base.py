"""Base model classes with enhanced soft delete functionality.

This module provides SQLAlchemy base models with production-ready soft delete
capabilities, audit trails, and timestamp tracking for all database entities.

The implementation follows PEP 8, PEP 257, and PEP 484 standards for
code quality, documentation, and type safety.
"""

from datetime import datetime
from typing import Any, List, Optional, Type, TypeVar, Union

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, event, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Query, Session
from sqlalchemy.sql import func

from src.project_name.core.database_manager import metadata

# Type variable for generic model operations
ModelType = TypeVar('ModelType', bound='BaseModel')


class Base(DeclarativeBase):
    """Base class for all models."""
    metadata = metadata


class TimestampMixin:
    """Mixin for adding timestamp fields to models.

    Attributes:
        created_at: Timestamp when the record was created.
        updated_at: Timestamp when the record was last updated.
    """

    @declared_attr
    def created_at(cls) -> Column:
        """Timestamp when the record was created."""
        return Column(
            DateTime,
            nullable=False,
            server_default=func.now(),
            doc="Timestamp when the record was created"
        )

    @declared_attr
    def updated_at(cls) -> Column:
        """Timestamp when the record was last updated."""
        return Column(
            DateTime,
            nullable=False,
            server_default=func.now(),
            onupdate=func.now(),
            doc="Timestamp when the record was last updated"
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
        class User(BaseModel):
            __tablename__ = 'users'
            name = Column(String(100))

        # Usage
        user = User(name="John Doe")
        user.soft_delete(deleted_by="admin", reason="Account inactive")

        # Check if deleted
        if user.is_soft_deleted:
            user.restore()
    """

    @declared_attr
    def deleted_at(cls) -> Column:
        """Timestamp when the record was soft deleted.

        Returns:
            Column: DateTime column with timezone support, indexed for performance.
        """
        return Column(
            DateTime(timezone=True),
            nullable=True,
            index=True,
            doc="Timestamp when the record was soft deleted (timezone-aware)"
        )

    @declared_attr
    def deleted_by(cls) -> Column:
        """Identifier of user/system that performed the deletion.

        Returns:
            Column: String column for storing user ID, username, or system identifier.
        """
        return Column(
            String(255),
            nullable=True,
            doc="Identifier of user/system that performed the deletion"
        )

    @declared_attr
    def deletion_reason(cls) -> Column:
        """Optional reason for the deletion.

        Returns:
            Column: Text column for storing deletion reason or notes.
        """
        return Column(
            Text,
            nullable=True,
            doc="Optional reason for the deletion"
        )

    @declared_attr
    def is_deleted(cls) -> Column:
        """Boolean flag indicating if the record is deleted.

        Returns:
            Column: Boolean column with index for fast filtering.
        """
        return Column(
            Boolean,
            nullable=False,
            server_default="false",
            default=False,
            index=True,
            doc="Boolean flag indicating if the record is deleted"
        )

    def soft_delete(
        self,
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None
    ) -> None:
        """Mark the record as soft deleted with audit information.

        Args:
            deleted_by: Identifier of user/system performing deletion.
            reason: Optional reason for deletion.

        Raises:
            ValueError: If the record is already soft deleted.

        Example:
            user.soft_delete(deleted_by="admin", reason="Policy violation")
        """
        if self.is_soft_deleted:
            record_id = getattr(self, 'id', 'unknown')
            raise ValueError(
                f"Record {self.__class__.__name__}(id={record_id}) is already deleted"
            )

        self.deleted_at = datetime.now()  # Using datetime.now() instead of utcnow()
        self.deleted_by = deleted_by
        self.deletion_reason = reason
        self.is_deleted = True

    def restore(self) -> None:
        """Restore a soft-deleted record.

        Clears all deletion-related fields and marks the record as active.

        Raises:
            ValueError: If the record is not currently soft deleted.

        Example:
            if user.is_soft_deleted:
                user.restore()
        """
        if not self.is_soft_deleted:
            record_id = getattr(self, 'id', 'unknown')
            raise ValueError(
                f"Record {self.__class__.__name__}(id={record_id}) is not deleted"
            )

        self.deleted_at = None
        self.deleted_by = None
        self.deletion_reason = None
        self.is_deleted = False

    @property
    def is_soft_deleted(self) -> bool:
        """Check if this record is soft deleted.

        Returns:
            bool: True if the record is soft deleted, False otherwise.
        """
        return self.is_deleted and self.deleted_at is not None

    @classmethod
    def filter_active(cls, query: Query) -> Query:
        """Filter query to only include non-deleted records.

        Args:
            query: SQLAlchemy query object.

        Returns:
            Query: Filtered query excluding soft-deleted records.

        Example:
            active_users = User.filter_active(session.query(User)).all()
        """
        return query.filter(cls.is_deleted == False)  # noqa: E712

    @classmethod
    def filter_deleted(cls, query: Query) -> Query:
        """Filter query to only include soft-deleted records.

        Args:
            query: SQLAlchemy query object.

        Returns:
            Query: Filtered query including only soft-deleted records.

        Example:
            deleted_users = User.filter_deleted(session.query(User)).all()
        """
        return query.filter(cls.is_deleted == True)  # noqa: E712

    @classmethod
    def filter_with_deleted(cls, query: Query) -> Query:
        """Return query without soft delete filtering.

        Args:
            query: SQLAlchemy query object.

        Returns:
            Query: Unfiltered query including both active and deleted records.

        Example:
            all_users = User.filter_with_deleted(session.query(User)).all()
        """
        return query


class BaseModel(Base, TimestampMixin, SoftDeleteMixin):
    """Base model class for all database entities.

    This class combines timestamp tracking and soft delete functionality
    for all models that inherit from it.

    Attributes:
        id: Primary key for the record.
    """

    __abstract__ = True

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        doc="Primary key for the record"
    )

    def __repr__(self) -> str:
        """Return a string representation of the model."""
        return f"<{self.__class__.__name__}(id={self.id})>"


# Automatically filter soft-deleted records in queries
@event.listens_for(Session, "do_orm_execute")
def receive_do_orm_execute(orm_execute_state: Any) -> None:
    """Automatically filter out soft-deleted records from queries.

    This event listener intercepts all ORM queries and adds a filter
    to exclude soft-deleted records unless explicitly included.

    Args:
        orm_execute_state: SQLAlchemy ORM execution state.
    """
    if orm_execute_state.is_select:
        for opt in orm_execute_state.update_execution_options:
            if opt.get("include_deleted", False):
                return

        # Add soft delete filter to all queries
        orm_execute_state.options = orm_execute_state.options.union(
            {"populate_existing": True}
        )
