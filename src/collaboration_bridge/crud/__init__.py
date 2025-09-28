"""
This module serves as a central point for importing all CRUD objects.
This makes it easier to import CRUD classes from other parts of the application,
such as API endpoints, reducing import path complexity.
"""

from .contact import contact_crud
from .interaction import interaction_crud
from .interaction_draft import (
    interaction_draft_crud,
    interaction_tactic_log_draft_crud,
)
from .rapport import rapport_tactic_crud