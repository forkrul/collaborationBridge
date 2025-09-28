from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.collaboration_bridge.api.deps import get_db
from src.collaboration_bridge.core.config import settings
from src.collaboration_bridge.crud import user as user_crud
from src.collaboration_bridge.schemas import user as user_schema
from jose import jwt, JWTError

router = APIRouter()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.post("/", response_model=user_schema.UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: user_schema.UserCreate, db: AsyncSession = Depends(get_db)
):
    """
    Create a new user.

    This endpoint registers a new user in the system with a unique email.
    The user's onboarding process is initialized to `not_started`.
    """
    db_user = await user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return await user_crud.create_user(db=db, user=user)


@router.post("/token", response_model=user_schema.Token)
async def login_for_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """
    Authenticate a user and return a JWT access token.

    This endpoint follows the OAuth2 password flow.
    The client must send a POST request with `username` (email) and `password`
    in a form-data body.
    """
    user = await user_crud.get_user_by_email(db, email=form_data.username)
    if not user or not user_crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}