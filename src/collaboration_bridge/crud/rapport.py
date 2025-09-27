from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from src.collaboration_bridge.crud.base import CRUDBase
from src.collaboration_bridge.models.rapport import RapportTactic, InteractionTacticLog
from src.collaboration_bridge.schemas.rapport import InteractionTacticLogCreate

class CRUDRapportTactic(CRUDBase[RapportTactic, None, None]):
    """
    CRUD operations for RapportTactics.
    This is mostly a read-only model from the API perspective,
    so Create/Update schemas are None.
    """
    async def get_all(self, db: AsyncSession) -> List[RapportTactic]:
        """Get all available rapport tactics."""
        query = select(self.model).order_by(self.model.name)
        result = await db.execute(query)
        return result.scalars().all()

class CRUDInteractionTacticLog(CRUDBase[InteractionTacticLog, InteractionTacticLogCreate, None]):
    """CRUD operations for InteractionTacticLogs."""
    pass

rapport_tactic_crud = CRUDRapportTactic(RapportTactic)
interaction_tactic_log_crud = CRUDInteractionTacticLog(InteractionTacticLog)