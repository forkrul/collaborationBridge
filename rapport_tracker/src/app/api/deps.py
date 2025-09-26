from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.app.core.database import get_db_session
from src.app.models.user import User

async def get_current_user(db: AsyncSession = Depends(get_db_session)) -> User:
    """
    Dependency to retrieve the current authenticated user.

    CRITICAL: This is a placeholder. In production, this MUST validate a JWT or session.
    """
    # --- Placeholder Implementation: Fetches the first active, non-deleted user ---
    from sqlalchemy.future import select
    query = select(User).where(User.is_active == True, User.deleted_at.is_(None)).limit(1)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        # In a real app, this is 401 Unauthorized.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active user found. Authentication system or seed data required.",
        )
    # --- End Placeholder Implementation ---

    return user