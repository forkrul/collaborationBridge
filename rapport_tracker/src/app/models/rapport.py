from enum import Enum
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.app.core.database import Base
from src.app.core.mixins import TimestampMixin
import uuid
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.app.models.interaction import Interaction

class ScientificDomain(str, Enum):
    """The primary research domain for the tactic."""
    COMMUNICATION = "Communication Studies"
    SOCIAL_PSYCHOLOGY = "Social Psychology"
    INFLUENCE = "Persuasion and Influence"

class RapportTactic(Base, TimestampMixin):
    """
    A reference table detailing science-validated techniques.

    Examples: Active Listening, Mirroring, Finding Similarity, Reciprocity, Praise.
    """
    __tablename__ = "rapport_tactics"

    name: Mapped[str] = mapped_column(sa.String(150), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(sa.Text, nullable=False)
    domain: Mapped[ScientificDomain] = mapped_column(sa.Enum(ScientificDomain), nullable=False)

    interaction_logs: Mapped[List["InteractionTacticLog"]] = relationship(back_populates="tactic")

class InteractionTacticLog(Base, TimestampMixin):
    """
    Logs the application and effectiveness of tactics during an interaction (Association Object).
    """
    __tablename__ = "interaction_tactic_logs"
    id = None

    # Composite Primary Key and Foreign Keys
    interaction_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("interactions.id"), primary_key=True)
    tactic_id: Mapped[uuid.UUID] = mapped_column(sa.ForeignKey("rapport_tactics.id"), primary_key=True)

    # Effectiveness rating (1-5), 1=Ineffective/Backfired, 5=Highly Effective
    effectiveness_score: Mapped[int] = mapped_column(sa.Integer, nullable=True)
    notes: Mapped[str] = mapped_column(sa.Text, nullable=True)

    # Relationships
    interaction: Mapped["Interaction"] = relationship(back_populates="tactic_logs")
    tactic: Mapped["RapportTactic"] = relationship(back_populates="interaction_logs")