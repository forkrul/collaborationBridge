"""Internationalization package for the application."""

from .config import DEFAULT_LOCALE, LOCALE_CONFIGS, SupportedLocale
from .manager import get_translation_manager, translate

__all__ = [
    "DEFAULT_LOCALE",
    "LOCALE_CONFIGS",
    "SupportedLocale",
    "get_translation_manager",
    "translate",
]
