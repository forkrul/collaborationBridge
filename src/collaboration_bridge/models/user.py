from typing import List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from collaboration_bridge.core.database import Base
from collaboration_bridge.core.mixins import SoftDeleteMixin, TimestampMixin
from collaboration_bridge.schemas.onboarding import OnboardingStatus


class User(Base, TimestampMixin, SoftDeleteMixin):
    """
    Represents an application user (the employee tracking interactions).
    """
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(sa.String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    onboarding_status: Mapped[OnboardingStatus] = mapped_column(
        sa.String(50),
        nullable=False,
        default=OnboardingStatus.NOT_STARTED,
        server_default=OnboardingStatus.NOT_STARTED.value,
    )

    # Relationships
    contacts: Mapped[List["Contact"]] = relationship(back_populates="user")
    interactions: Mapped[List["Interaction"]] = relationship(back_populates="user")
