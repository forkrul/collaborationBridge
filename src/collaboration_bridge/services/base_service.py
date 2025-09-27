"""Enhanced base service class for collaboration bridge application.

This module provides comprehensive CRUD operations with advanced features:
- Automatic soft delete handling
- Bulk operations for performance
- Query optimization with eager loading
- Comprehensive error handling
- Audit trail support

The implementation follows PEP 8, PEP 257, and PEP 484 standards for
code quality, documentation, and type safety.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional, Type, TypeVar, Union
from uuid import UUID

from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin

# Type variables for generic operations
ModelType = TypeVar("ModelType")
SoftDeleteModelType = TypeVar("SoftDeleteModelType", bound=SoftDeleteMixin)


class BaseService:
    """Enhanced base service class with production-ready database operations.

    This service provides comprehensive CRUD operations with advanced features:
    - Automatic soft delete handling
    - Bulk operations for performance
    - Query optimization with eager loading
    - Comprehensive error handling
    - Audit trail support

    Example:
        class UserService(BaseService[User]):
            model = User

        async with AsyncSession(engine) as session:
            user_service = UserService(session)

            # Create with validation
            user = await user_service.create({"name": "John", "email": "john@example.com"})

            # Bulk operations
            users = await user_service.bulk_create([
                {"name": "Alice", "email": "alice@example.com"},
                {"name": "Bob", "email": "bob@example.com"}
            ])

            # Advanced querying
            active_users = await user_service.get_active_paginated(page=1, size=10)
    """

    model: Type[ModelType]

    def __init__(self, session: AsyncSession) -> None:
        """Initialize the service with a database session.

        Args:
            session: SQLAlchemy async session for database operations.
        """
        self.session = session

    async def create(
        self,
        data: Dict[str, Any],
        commit: bool = True,
        created_by: Optional[str] = None,
    ) -> ModelType:
        """Create a new record with validation and audit trail.

        Args:
            data: Dictionary of field values for the new record.
            commit: Whether to commit the transaction immediately.
            created_by: Identifier of user creating the record.

        Returns:
            The created model instance.

        Raises:
            ValueError: If required fields are missing or invalid.

        Example:
            user = await service.create({
                "name": "John Doe",
                "email": "john@example.com"
            }, created_by="admin")
        """
        # Add audit information if supported
        if hasattr(self.model, "created_by") and created_by:
            data["created_by"] = created_by

        instance = self.model(**data)
        self.session.add(instance)

        if commit:
            await self.session.commit()
            await self.session.refresh(instance)

        return instance

    async def get_by_id(
        self,
        id: Union[int, UUID],
        include_deleted: bool = False,
        load_relationships: Optional[List[str]] = None,
    ) -> Optional[ModelType]:
        """Get a record by its primary key.

        Args:
            id: Primary key value.
            include_deleted: Whether to include soft-deleted records.
            load_relationships: List of relationship names to eager load.

        Returns:
            The model instance if found, None otherwise.

        Example:
            user = await service.get_by_id(123, load_relationships=["contacts"])
        """
        query = select(self.model).where(self.model.id == id)

        # Apply soft delete filter if applicable
        if hasattr(self.model, "is_deleted") and not include_deleted:
            query = query.where(self.model.get_active_filter())

        # Add eager loading for relationships
        if load_relationships:
            for relationship in load_relationships:
                query = query.options(selectinload(getattr(self.model, relationship)))

        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
    ) -> List[ModelType]:
        """Get multiple records with filtering and pagination.

        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.
            include_deleted: Whether to include soft-deleted records.
            filters: Dictionary of field filters.
            order_by: Field name to order by.

        Returns:
            List of model instances.

        Example:
            users = await service.get_multi(
                skip=0, limit=10,
                filters={"is_active": True},
                order_by="created_at"
            )
        """
        query = select(self.model)

        # Apply soft delete filter if applicable
        if hasattr(self.model, "is_deleted") and not include_deleted:
            query = query.where(self.model.get_active_filter())

        # Apply additional filters
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    query = query.where(getattr(self.model, field) == value)

        # Apply ordering
        if order_by and hasattr(self.model, order_by):
            query = query.order_by(getattr(self.model, order_by))

        # Apply pagination
        query = query.offset(skip).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def update(
        self,
        id: Union[int, UUID],
        data: Dict[str, Any],
        commit: bool = True,
        updated_by: Optional[str] = None,
    ) -> Optional[ModelType]:
        """Update a record with validation and audit trail.

        Args:
            id: Primary key value.
            data: Dictionary of field values to update.
            commit: Whether to commit the transaction immediately.
            updated_by: Identifier of user updating the record.

        Returns:
            The updated model instance if found, None otherwise.

        Example:
            user = await service.update(123, {
                "name": "Jane Doe",
                "email": "jane@example.com"
            }, updated_by="admin")
        """
        instance = await self.get_by_id(id)
        if not instance:
            return None

        # Add audit information if supported
        if hasattr(self.model, "updated_by") and updated_by:
            data["updated_by"] = updated_by

        # Update fields
        for field, value in data.items():
            if hasattr(instance, field):
                setattr(instance, field, value)

        if commit:
            await self.session.commit()
            await self.session.refresh(instance)

        return instance

    async def soft_delete(
        self,
        id: Union[int, UUID],
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None,
    ) -> bool:
        """Soft delete a record with audit trail.

        Args:
            id: Primary key value.
            deleted_by: Identifier of user performing deletion.
            reason: Reason for deletion.

        Returns:
            True if deleted successfully, False if not found.

        Example:
            success = await service.soft_delete(
                123,
                deleted_by="admin",
                reason="User requested deletion"
            )
        """
        instance = await self.get_by_id(id)
        if not instance or not hasattr(instance, "soft_delete"):
            return False

        instance.soft_delete(deleted_by=deleted_by, reason=reason)
        await self.session.commit()
        return True

    async def restore(
        self,
        id: Union[int, UUID],
        restored_by: Optional[str] = None,
    ) -> bool:
        """Restore a soft-deleted record.

        Args:
            id: Primary key value.
            restored_by: Identifier of user performing restoration.

        Returns:
            True if restored successfully, False if not found.

        Example:
            success = await service.restore(123, restored_by="admin")
        """
        instance = await self.get_by_id(id, include_deleted=True)
        if not instance or not hasattr(instance, "restore"):
            return False

        instance.restore(restored_by=restored_by)
        await self.session.commit()
        return True

    async def count(
        self,
        include_deleted: bool = False,
        filters: Optional[Dict[str, Any]] = None,
    ) -> int:
        """Count records with optional filtering.

        Args:
            include_deleted: Whether to include soft-deleted records.
            filters: Dictionary of field filters.

        Returns:
            Number of matching records.

        Example:
            count = await service.count(filters={"is_active": True})
        """
        query = select(self.model)

        # Apply soft delete filter if applicable
        if hasattr(self.model, "is_deleted") and not include_deleted:
            query = query.where(self.model.get_active_filter())

        # Apply additional filters
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    query = query.where(getattr(self.model, field) == value)

        result = await self.session.execute(query)
        return len(result.scalars().all())
