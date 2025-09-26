import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.crud.rapport import rapport_tactic_crud
from src.app.core.seed_data import SEED_TACTICS
from src.app.models.rapport import RapportTactic

@pytest.mark.asyncio
async def test_get_all_rapport_tactics(db_session: AsyncSession) -> None:
    """
    Test retrieving all rapport tactics by manually creating them first.
    """
    # Manually create the tactic objects for this test session
    for tactic_data in SEED_TACTICS:
        db_session.add(RapportTactic(**tactic_data))
    await db_session.commit()

    # Retrieve all tactics from the database
    tactics = await rapport_tactic_crud.get_all(db=db_session)

    # Verify that the number of retrieved tactics matches the seed data
    assert len(tactics) == len(SEED_TACTICS)

    # Verify that the names of the retrieved tactics match the seed data
    retrieved_names = sorted([t.name for t in tactics])
    seed_names = sorted([t['name'] for t in SEED_TACTICS])
    assert retrieved_names == seed_names