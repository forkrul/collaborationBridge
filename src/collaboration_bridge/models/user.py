from typing import List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.collaboration_bridge.core.database import Base
from src.collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin


class User(Base, TimestampMixin, SoftDeleteMixin):
    """
    Represents an application user (the employee tracking interactions).
    """
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(sa.String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    contacts: Mapped[List["Contact"]] = relationship(back_populates="user")
    interactions: Mapped[List["Interaction"]] = relationship(back_populates="user")
    onboarding_progress: Mapped["Onboarding"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
