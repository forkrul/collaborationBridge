import uuid
from typing import Any, Dict, Generic, Optional, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from collaboration_bridge.core.database import Base
from collaboration_bridge.core.mixins import SoftDeleteMixin

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Generic CRUD object. Handles soft-delete filtering automatically.
    """
    def __init__(self, model: Type[ModelType]):
        self.model = model
        # Check if the model inherits from SoftDeleteMixin (robust check)
        self.is_soft_deletable = issubclass(model, SoftDeleteMixin)

    def _get_active_filter(self) -> Any:
        """Returns the filter condition for active (non-deleted) records."""
        if self.is_soft_deletable:
            # Use the enhanced filter method from the mixin
            return self.model.get_active_filter()
        return True  # If not soft-deletable, always return True (no filter)

    async def get(self, db: AsyncSession, id: uuid.UUID) -> Optional[ModelType]:
        """Get a single record by ID, filtering out soft-deleted items."""
        query = select(self.model).where(
            and_(
                self.model.id == id,
                self._get_active_filter()
            )
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType | Dict[str, Any]) -> ModelType:
        """Create a new record."""
        if isinstance(obj_in, dict):
            obj_in_data = obj_in
        else:
            # Pydantic v2 uses model_dump
            obj_in_data = obj_in.model_dump(exclude_unset=True)

        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: ModelType, obj_in: UpdateSchemaType | Dict[str, Any]
    ) -> ModelType:
        """Update an existing record (supports partial updates)."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # Exclude unset fields to allow partial updates (PATCH behavior)
            update_data = obj_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None
    ) -> ModelType:
        """
        Remove a record. Uses soft delete if supported, otherwise hard delete.
        Requires the object instance (ensuring authorization checks happen before calling).

        Args:
            db: Database session.
            db_obj: The object instance to remove.
            deleted_by: Identifier of user performing deletion.
            reason: Reason for deletion.
        """
        if self.is_soft_deletable:
            # Utilize the enhanced soft_delete method with audit trail
            db_obj.soft_delete(deleted_by=deleted_by, reason=reason)
            db.add(db_obj)
        else:
            await db.delete(db_obj)

        await db.commit()
        # Refresh if soft-deleted to update the deleted_at timestamp in the returned object
        if self.is_soft_deletable:
            await db.refresh(db_obj)
        return db_obj

    async def restore(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        restored_by: Optional[str] = None
    ) -> ModelType:
        """
        Restore a soft-deleted record.

        Args:
            db: Database session.
            db_obj: The object instance to restore.
            restored_by: Identifier of user performing restoration.
        """
        if self.is_soft_deletable and hasattr(db_obj, 'restore'):
            db_obj.restore(restored_by=restored_by)
            db.add(db_obj)
            await db.commit()
            await db.refresh(db_obj)
        return db_obj
