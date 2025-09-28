import uuid
from typing import List

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.collaboration_bridge.crud.base import CRUDBase
from src.collaboration_bridge.models.interaction import Interaction
from src.collaboration_bridge.models.rapport import InteractionTacticLog
from src.collaboration_bridge.schemas.interaction import InteractionCreate
from src.collaboration_bridge.schemas.rapport import InteractionTacticLogCreate


class CRUDInteraction(CRUDBase[Interaction, InteractionCreate, None]):
    """
    CRUD operations for Interactions, with specialized creation logic.
    """
    async def create_with_tactics(
        self,
        db: AsyncSession,
        *,
        obj_in: InteractionCreate,
        user_id: uuid.UUID,
        tactic_logs_in: List[InteractionTacticLogCreate]
    ) -> Interaction:
        """
        Create a new interaction and its associated tactic logs in a single transaction.
        """
        interaction_data = obj_in.model_dump()
        interaction = Interaction(**interaction_data, user_id=user_id)
        db.add(interaction)
        await db.flush()

        for log_in in tactic_logs_in:
            log_data = log_in.model_dump()
            db_log = InteractionTacticLog(
                **log_data,
                interaction_id=interaction.id
            )
            db.add(db_log)

        await db.commit()
        # Eagerly load the tactic_logs relationship to prevent serialization errors
        await db.refresh(interaction, ["tactic_logs"])
        return interaction

    async def get_multi_by_user_and_contact(
        self,
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        contact_id: uuid.UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Interaction]:
        """Get all active interactions for a specific user and contact, eager-loading tactics."""
        query = (
            select(self.model)
            .options(selectinload(self.model.tactic_logs))
            .where(
                and_(
                    self.model.user_id == user_id,
                    self.model.contact_id == contact_id,
                    self._get_active_filter()
                )
            )
            .order_by(self.model.interaction_datetime.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

interaction_crud = CRUDInteraction(Interaction)