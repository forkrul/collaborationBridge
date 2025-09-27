from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
import uuid
from typing import List, Optional

from src.collaboration_bridge.crud.base import CRUDBase
from src.collaboration_bridge.models.contact import Contact
from src.collaboration_bridge.schemas.contact import ContactCreate, ContactUpdate

class CRUDContact(CRUDBase[Contact, ContactCreate, ContactUpdate]):
    """
    CRUD operations for Contacts, ensuring operations are scoped to the user.
    """

    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: ContactCreate, user_id: uuid.UUID
    ) -> Contact:
        """Create a contact associated with a specific user."""
        # Use the base create method by combining the input data and the user_id
        obj_data = obj_in.model_dump()
        obj_data['user_id'] = user_id
        return await self.create(db=db, obj_in=obj_data)

    async def get_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID, contact_id: uuid.UUID
    ) -> Optional[Contact]:
        """Get a specific contact only if it belongs to the user and is active."""
        query = select(self.model).where(
            and_(
                self.model.id == contact_id,
                self.model.user_id == user_id,
                self._get_active_filter() # Inherited soft-delete check
            )
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_multi_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Contact]:
        """Get all active contacts for a specific user."""
        query = (
            select(self.model)
            .where(
                and_(
                    self.model.user_id == user_id,
                    self._get_active_filter()
                )
            )
            .order_by(self.model.name)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

# Instantiate the CRUD class for use in the API layer
contact_crud = CRUDContact(Contact)