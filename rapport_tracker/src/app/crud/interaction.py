from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
import uuid
from typing import List, Optional

from src.app.crud.base import CRUDBase
from src.app.models.interaction import Interaction
from src.app.schemas.interaction import InteractionCreate
from src.app.models.rapport import InteractionTacticLog
from src.app.schemas.rapport import InteractionTacticLogCreate


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
        # Create the main interaction object
        interaction_data = obj_in.model_dump()
        interaction = Interaction(**interaction_data, user_id=user_id)
        db.add(interaction)

        # Flush the session to get the generated ID for the interaction
        await db.flush()

        # Create the tactic log objects
        for log_in in tactic_logs_in:
            log_data = log_in.model_dump()
            db_log = InteractionTacticLog(
                **log_data,
                interaction_id=interaction.id
            )
            db.add(db_log)

        await db.commit()
        await db.refresh(interaction)
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
        """Get all active interactions for a specific user and contact."""
        query = (
            select(self.model)
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

# Instantiate the CRUD class for use in the API layer
interaction_crud = CRUDInteraction(Interaction)