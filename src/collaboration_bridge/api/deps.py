from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from collaboration_bridge.core.config import settings
from collaboration_bridge.core.database import AsyncSessionLocal
from collaboration_bridge.crud import user as user_crud
from collaboration_bridge.models.user import User
from collaboration_bridge.schemas import user as user_schema

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/token")


async def get_db():
    """FastAPI dependency to provide a database session."""
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependency to retrieve the current authenticated user from a JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = user_schema.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await user_crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user