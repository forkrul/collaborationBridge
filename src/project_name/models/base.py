"""Base model classes with soft delete functionality.

This module provides SQLAlchemy base models with built-in soft delete
capabilities and timestamp tracking for all database entities.
"""

from datetime import datetime
from typing import Any, Optional, Type

from sqlalchemy import Boolean, Column, DateTime, Integer, String, event
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Query, Session
from sqlalchemy.sql import func

from src.project_name.core.database_manager import metadata


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
    """Mixin for adding soft delete functionality to models.
    
    This mixin adds a deleted_at field and provides methods for
    soft deleting and restoring records.
    
    Attributes:
        deleted_at: Timestamp when the record was soft deleted.
        is_deleted: Boolean flag indicating if the record is deleted.
    """
    
    @declared_attr
    def deleted_at(cls) -> Column:
        """Timestamp when the record was soft deleted."""
        return Column(
            DateTime,
            nullable=True,
            doc="Timestamp when the record was soft deleted"
        )
    
    @declared_attr
    def is_deleted(cls) -> Column:
        """Boolean flag indicating if the record is deleted."""
        return Column(
            Boolean,
            nullable=False,
            server_default="false",
            default=False,
            index=True,
            doc="Boolean flag indicating if the record is deleted"
        )
    
    def soft_delete(self) -> None:
        """Mark the record as deleted."""
        self.deleted_at = datetime.utcnow()
        self.is_deleted = True
    
    def restore(self) -> None:
        """Restore a soft-deleted record."""
        self.deleted_at = None
        self.is_deleted = False
    
    @classmethod
    def filter_active(cls, query: Query) -> Query:
        """Filter query to only include non-deleted records.
        
        Args:
            query: SQLAlchemy query object.
            
        Returns:
            Query filtered to exclude soft-deleted records.
        """
        return query.filter(cls.is_deleted == False)


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
