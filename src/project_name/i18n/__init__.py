"""Internationalization package for the application."""

from .config import SupportedLocale, LOCALE_CONFIGS, DEFAULT_LOCALE
from .manager import get_translation_manager, translate

__all__ = [
    "SupportedLocale",
    "LOCALE_CONFIGS", 
    "DEFAULT_LOCALE",
    "get_translation_manager",
    "translate",
]
