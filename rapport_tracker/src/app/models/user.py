from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.app.core.database import Base
from src.app.core.mixins import TimestampMixin, SoftDeleteMixin
import sqlalchemy as sa
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.app.models.contact import Contact
    from src.app.models.interaction import Interaction


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