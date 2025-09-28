from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr = Field(..., description="User's email address")
    full_name: str = Field(..., min_length=1, max_length=255, description="User's full name")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, description="User's password")


class UserRead(UserBase):
    """Schema for reading user data."""
    id: UUID = Field(..., description="Unique identifier for the user")
    is_active: bool = Field(..., description="Indicates if the user account is active")

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for the authentication token."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Type of the token")


class TokenData(BaseModel):
    """Schema for the data encoded in the token."""
    email: EmailStr | None = Field(None, description="User's email from token")