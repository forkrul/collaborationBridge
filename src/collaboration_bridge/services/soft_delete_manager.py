"""Production-ready soft delete manager for bulk operations and advanced features.

This module provides comprehensive soft delete management capabilities including:
- Bulk soft delete and restore operations
- Hard delete with retention policies
- Advanced query filtering and recovery
- Audit trail management
- Performance-optimized batch operations

The implementation follows PEP 8, PEP 257, and PEP 484 standards for
code quality, documentation, and type safety.
"""

from datetime import datetime, timedelta
from typing import Any, List, Optional, Type, TypeVar, Union
from uuid import UUID

from sqlalchemy import and_, delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.core.mixins import SoftDeleteMixin

# Type variable for models with soft delete capability
SoftDeleteModelType = TypeVar("SoftDeleteModelType", bound=SoftDeleteMixin)


class SoftDeleteManager:
    """Manager class for advanced soft delete operations.

    This class provides bulk operations, recovery management, and advanced
    filtering capabilities for models with soft delete functionality.

    Example:
        async with AsyncSession(engine) as session:
            manager = SoftDeleteManager(session)

            # Bulk soft delete
            deleted_count = await manager.bulk_soft_delete(
                User, [1, 2, 3], deleted_by="admin", reason="Cleanup"
            )

            # Bulk restore
            restored_count = await manager.bulk_restore(User, [1, 2])

            # Hard delete old records
            purged_count = await manager.hard_delete_before(
                User, datetime.now() - timedelta(days=90)
            )
    """

    def __init__(self, session: AsyncSession) -> None:
        """Initialize the manager with a database session.

        Args:
            session: SQLAlchemy async session for database operations.
        """
        self.session = session

    async def bulk_soft_delete(
        self,
        model: Type[SoftDeleteModelType],
        ids: List[Union[int, UUID]],
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None,
        commit: bool = True,
    ) -> int:
        """Perform bulk soft delete on multiple records.

        Args:
            model: The model class to operate on.
            ids: List of primary key values to delete.
            deleted_by: Identifier of user performing deletion.
            reason: Reason for deletion.
            commit: Whether to commit the transaction immediately.

        Returns:
            Number of records successfully deleted.

        Example:
            deleted_count = await manager.bulk_soft_delete(
                User, [1, 2, 3], deleted_by="admin", reason="Bulk cleanup"
            )
        """
        if not ids:
            return 0

        update_data = {
            "deleted_at": datetime.now(),
            "is_deleted": True,
        }

        if deleted_by:
            update_data["deleted_by"] = deleted_by
        if reason:
            update_data["deletion_reason"] = reason

        query = (
            update(model)
            .where(
                and_(
                    model.id.in_(ids),
                    model.get_active_filter()
                )
            )
            .values(**update_data)
        )

        result = await self.session.execute(query)
        
        if commit:
            await self.session.commit()

        return result.rowcount

    async def bulk_restore(
        self,
        model: Type[SoftDeleteModelType],
        ids: List[Union[int, UUID]],
        restored_by: Optional[str] = None,
        commit: bool = True,
    ) -> int:
        """Perform bulk restore on multiple soft-deleted records.

        Args:
            model: The model class to operate on.
            ids: List of primary key values to restore.
            restored_by: Identifier of user performing restoration.
            commit: Whether to commit the transaction immediately.

        Returns:
            Number of records successfully restored.

        Example:
            restored_count = await manager.bulk_restore(
                User, [1, 2, 3], restored_by="admin"
            )
        """
        if not ids:
            return 0

        update_data = {
            "deleted_at": None,
            "deleted_by": None,
            "deletion_reason": None,
            "is_deleted": False,
        }

        query = (
            update(model)
            .where(
                and_(
                    model.id.in_(ids),
                    model.get_deleted_filter()
                )
            )
            .values(**update_data)
        )

        result = await self.session.execute(query)
        
        if commit:
            await self.session.commit()

        return result.rowcount

    async def hard_delete_before(
        self,
        model: Type[SoftDeleteModelType],
        before_date: datetime,
        commit: bool = True,
    ) -> int:
        """Permanently delete records that were soft-deleted before a specific date.

        Args:
            model: The model class to operate on.
            before_date: Delete records soft-deleted before this date.
            commit: Whether to commit the transaction immediately.

        Returns:
            Number of records permanently deleted.

        Example:
            # Delete records soft-deleted more than 90 days ago
            purged_count = await manager.hard_delete_before(
                User, datetime.now() - timedelta(days=90)
            )
        """
        query = delete(model).where(
            and_(
                model.get_deleted_filter(),
                model.deleted_at < before_date
            )
        )

        result = await self.session.execute(query)
        
        if commit:
            await self.session.commit()

        return result.rowcount

    async def get_deleted_records(
        self,
        model: Type[SoftDeleteModelType],
        skip: int = 0,
        limit: int = 100,
        deleted_after: Optional[datetime] = None,
        deleted_by: Optional[str] = None,
    ) -> List[SoftDeleteModelType]:
        """Retrieve soft-deleted records with filtering options.

        Args:
            model: The model class to query.
            skip: Number of records to skip.
            limit: Maximum number of records to return.
            deleted_after: Only include records deleted after this date.
            deleted_by: Only include records deleted by this user/system.

        Returns:
            List of soft-deleted model instances.

        Example:
            deleted_users = await manager.get_deleted_records(
                User, deleted_after=datetime.now() - timedelta(days=30)
            )
        """
        query = select(model).where(model.get_deleted_filter())

        if deleted_after:
            query = query.where(model.deleted_at >= deleted_after)
        
        if deleted_by:
            query = query.where(model.deleted_by == deleted_by)

        query = query.order_by(model.deleted_at.desc()).offset(skip).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def count_deleted_records(
        self,
        model: Type[SoftDeleteModelType],
        deleted_after: Optional[datetime] = None,
        deleted_by: Optional[str] = None,
    ) -> int:
        """Count soft-deleted records with filtering options.

        Args:
            model: The model class to query.
            deleted_after: Only count records deleted after this date.
            deleted_by: Only count records deleted by this user/system.

        Returns:
            Number of matching soft-deleted records.

        Example:
            count = await manager.count_deleted_records(
                User, deleted_after=datetime.now() - timedelta(days=7)
            )
        """
        query = select(model).where(model.get_deleted_filter())

        if deleted_after:
            query = query.where(model.deleted_at >= deleted_after)
        
        if deleted_by:
            query = query.where(model.deleted_by == deleted_by)

        result = await self.session.execute(query)
        return len(result.scalars().all())

    async def cleanup_old_deleted_records(
        self,
        model: Type[SoftDeleteModelType],
        retention_days: int = 90,
        commit: bool = True,
    ) -> int:
        """Clean up old soft-deleted records based on retention policy.

        Args:
            model: The model class to clean up.
            retention_days: Number of days to retain soft-deleted records.
            commit: Whether to commit the transaction immediately.

        Returns:
            Number of records permanently deleted.

        Example:
            # Clean up records older than 90 days
            cleaned_count = await manager.cleanup_old_deleted_records(User, 90)
        """
        cutoff_date = datetime.now() - timedelta(days=retention_days)
        return await self.hard_delete_before(model, cutoff_date, commit=commit)
