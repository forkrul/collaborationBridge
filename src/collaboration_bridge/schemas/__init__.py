"""
This module serves as a central point for importing all Pydantic schemas.
This makes it easier to import schemas from other parts of the application,
reducing import path complexity.
"""

from .base import BaseSchema, CoreRead
from .contact import ContactCreate, ContactRead, ContactUpdate
from .interaction import InteractionCreate, InteractionRead
from .interaction_draft import (
    InteractionDraftCreate,
    InteractionDraftRead,
    InteractionDraftStep1Contact,
    InteractionDraftStep2Details,
    InteractionDraftStep3Tactic,
    InteractionDraftUpdate,
)
from .rapport import (
    InteractionTacticLogCreate,
    InteractionTacticLogRead,
    RapportTacticRead,
)