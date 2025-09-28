import uuid
from typing import List, Any, Dict

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.collaboration_bridge.crud.base import CRUDBase, CreateSchemaType, UpdateSchemaType
from src.collaboration_bridge.models.interaction_draft import (
    InteractionDraft,
    InteractionTacticLogDraft,
)
from src.collaboration_bridge.schemas.interaction_draft import (
    InteractionDraftCreate,
    InteractionDraftUpdate,
)


class CRUDInteractionDraft(
    CRUDBase[InteractionDraft, InteractionDraftCreate, InteractionDraftUpdate]
):
    """CRUD operations for InteractionDraft."""

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType | Dict[str, Any]) -> InteractionDraft:
        """
        Create a new interaction draft and eager-load the (empty) tactic_log_drafts relationship.
        """
        db_obj = await super().create(db=db, obj_in=obj_in)
        # Eagerly load the relationship to prevent serialization errors
        await db.refresh(db_obj, ["tactic_log_drafts"])
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: InteractionDraft, obj_in: UpdateSchemaType | Dict[str, Any]
    ) -> InteractionDraft:
        """
        Update an interaction draft and eager-load the tactic_log_drafts relationship.
        """
        updated_db_obj = await super().update(db=db, db_obj=db_obj, obj_in=obj_in)
        # Eagerly load the relationship to prevent serialization errors
        await db.refresh(updated_db_obj, ["tactic_log_drafts"])
        return updated_db_obj

    async def get_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID, draft_id: uuid.UUID
    ) -> InteractionDraft | None:
        """Get a specific draft by ID, ensuring it belongs to the user and eager-loading tactics."""
        query = (
            select(self.model)
            .options(selectinload(self.model.tactic_log_drafts))
            .where(
                and_(
                    self.model.id == draft_id,
                    self.model.user_id == user_id,
                    self.model.is_deleted.is_(False),
                )
            )
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_all_by_user(
        self, db: AsyncSession, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[InteractionDraft]:
        """Get all active drafts for a specific user, eager-loading tactics."""
        query = (
            select(self.model)
            .options(selectinload(self.model.tactic_log_drafts))
            .where(
                and_(
                    self.model.user_id == user_id,
                    self.model.is_deleted.is_(False),
                )
            )
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()


class CRUDInteractionTacticLogDraft(CRUDBase):
    """CRUD operations for InteractionTacticLogDraft."""
    pass


interaction_draft_crud = CRUDInteractionDraft(InteractionDraft)
interaction_tactic_log_draft_crud = CRUDInteractionTacticLogDraft(
    InteractionTacticLogDraft
)