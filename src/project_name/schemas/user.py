"""User schemas example.

This demonstrates how to create Pydantic schemas for API models.
"""

from pydantic import EmailStr, Field

from src.project_name.schemas.base import BaseSchema, TimestampSchema


class UserBase(BaseSchema):
    """Base user schema with common fields."""

    email: EmailStr = Field(..., description="User's email address")
    username: str = Field(
        ..., min_length=3, max_length=100, description="User's username"
    )
    full_name: str | None = Field(None, max_length=255, description="User's full name")
    is_active: bool = Field(True, description="Whether the user account is active")


class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str = Field(..., min_length=8, description="User's password")


class UserUpdate(BaseSchema):
    """Schema for updating a user."""

    email: EmailStr | None = Field(None, description="User's email address")
    username: str | None = Field(
        None, min_length=3, max_length=100, description="User's username"
    )
    full_name: str | None = Field(None, max_length=255, description="User's full name")
    is_active: bool | None = Field(
        None, description="Whether the user account is active"
    )


class UserInDB(UserBase, TimestampSchema):
    """Schema for user data stored in database."""

    id: int = Field(..., description="User's unique identifier")
    is_superuser: bool = Field(
        False, description="Whether the user has superuser privileges"
    )


class UserResponse(UserInDB):
    """Schema for user data in API responses."""

    pass


class UserLogin(BaseSchema):
    """Schema for user login."""

    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="User's password")


class Token(BaseSchema):
    """Schema for authentication tokens."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Token type")


class TokenData(BaseSchema):
    """Schema for token data."""

    user_id: int | None = Field(None, description="User ID from token")
