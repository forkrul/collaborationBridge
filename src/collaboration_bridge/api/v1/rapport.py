from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from collaboration_bridge.api import deps
from collaboration_bridge.crud.rapport import rapport_tactic_crud
from collaboration_bridge.models.user import User
from collaboration_bridge.schemas.rapport import RapportTacticRead

router = APIRouter()

@router.get("/tactics", response_model=List[RapportTacticRead])
async def read_rapport_tactics(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> List[RapportTacticRead]:
    """
    Retrieve all available rapport-building tactics from the database.

    This endpoint is now protected and requires authentication.
    """
    tactics = await rapport_tactic_crud.get_all(db=db)
    return tactics
