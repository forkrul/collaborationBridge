"""Service layer for collaboration bridge application.

This module provides enhanced service classes with production-ready features
for managing database operations, soft deletes, and business logic.
"""

from .base_service import BaseService
from .soft_delete_manager import SoftDeleteManager

__all__ = [
    "BaseService",
    "SoftDeleteManager",
]
