"""User model example.

This is an example model to demonstrate the template usage.
"""

from sqlalchemy import Boolean, Column, String

from src.project_name.models.base import BaseModel


class User(BaseModel):
    """User model with authentication capabilities.

    This model demonstrates how to create models using the BaseModel
    which includes timestamps and soft delete functionality.
    """

    __tablename__ = "users"

    email = Column(
        String(255), unique=True, index=True, nullable=False, doc="User's email address"
    )
    username = Column(
        String(100), unique=True, index=True, nullable=False, doc="User's username"
    )
    full_name = Column(String(255), nullable=True, doc="User's full name")
    hashed_password = Column(String(255), nullable=False, doc="Hashed password")
    is_active = Column(
        Boolean, default=True, nullable=False, doc="Whether the user account is active"
    )
    is_superuser = Column(
        Boolean,
        default=False,
        nullable=False,
        doc="Whether the user has superuser privileges",
    )

    def __repr__(self) -> str:
        """Return string representation of the user."""
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"
