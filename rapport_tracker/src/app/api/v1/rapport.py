from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.core.database import get_db_session
from src.app.crud.rapport import rapport_tactic_crud
from src.app.schemas.rapport import RapportTacticRead

router = APIRouter()

@router.get("/tactics", response_model=List[RapportTacticRead])
async def read_rapport_tactics(
    db: AsyncSession = Depends(get_db_session),
) -> List[RapportTacticRead]:
    """
    Retrieve all available rapport-building tactics from the database.
    """
    tactics = await rapport_tactic_crud.get_all(db=db)
    return tactics