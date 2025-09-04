"""Translation manager for server-side internationalization."""

import gettext
from functools import lru_cache
from pathlib import Path
from typing import Any

from babel import Locale
from babel.dates import format_datetime
from babel.numbers import format_currency, format_decimal

from .config import DEFAULT_LOCALE, FALLBACK_LOCALE, LOCALE_CONFIGS, SupportedLocale


class TranslationManager:
    """Manages translations and localization for the application."""

    def __init__(self, locale_dir: Path | None = None):
        """Initialize the translation manager.

        Args:
            locale_dir: Directory containing translation files.
        """
        self.locale_dir = locale_dir or self._get_default_locale_dir()
        self._translations: dict[str, gettext.GNUTranslations] = {}
        self._load_translations()

    def _get_default_locale_dir(self) -> Path:
        """Get the default locale directory."""
        return Path(__file__).parent / "locales"

    def _load_translations(self) -> None:
        """Load all available translations."""
        for locale in SupportedLocale:
            try:
                translation = gettext.translation(
                    "messages",
                    localedir=str(self.locale_dir),
                    languages=[locale.value],
                    fallback=True,
                )
                self._translations[locale.value] = translation
            except FileNotFoundError:
                # Use fallback for missing translations
                if locale.value != FALLBACK_LOCALE.value:
                    self._translations[locale.value] = self._translations.get(
                        FALLBACK_LOCALE.value, gettext.NullTranslations()
                    )

    @lru_cache(maxsize=1000)
    def translate(self, message: str, locale: str, **kwargs) -> str:
        """Translate a message to the specified locale.

        Args:
            message: Message to translate.
            locale: Target locale.
            **kwargs: Variables for message formatting.

        Returns:
            Translated message.
        """
        if locale not in self._translations:
            locale = FALLBACK_LOCALE.value

        translation = self._translations[locale]
        translated = translation.gettext(message)

        # Format with variables if provided
        if kwargs:
            try:
                translated = translated.format(**kwargs)
            except (KeyError, ValueError):
                # Fall back to original if formatting fails
                pass

        return translated

    def format_datetime(self, dt: Any, locale: str, format_type: str = "medium") -> str:
        """Format datetime according to locale.

        Args:
            dt: Datetime object to format.
            locale: Target locale.
            format_type: Format type (short, medium, long, full).

        Returns:
            Formatted datetime string.
        """
        babel_locale = Locale.parse(locale.replace("_", "-"), sep="-")
        return format_datetime(dt, format=format_type, locale=babel_locale)

    def format_currency(
        self, amount: float, locale: str, currency: str | None = None
    ) -> str:
        """Format currency according to locale.

        Args:
            amount: Amount to format.
            locale: Target locale.
            currency: Currency code (defaults to locale's currency).

        Returns:
            Formatted currency string.
        """
        if not currency:
            currency = LOCALE_CONFIGS[locale].currency

        babel_locale = Locale.parse(locale.replace("_", "-"), sep="-")
        return format_currency(amount, currency, locale=babel_locale)

    def format_number(self, number: float, locale: str) -> str:
        """Format number according to locale.

        Args:
            number: Number to format.
            locale: Target locale.

        Returns:
            Formatted number string.
        """
        babel_locale = Locale.parse(locale.replace("_", "-"), sep="-")
        return format_decimal(number, locale=babel_locale)


# Global translation manager instance
_translation_manager: TranslationManager | None = None


def get_translation_manager() -> TranslationManager:
    """Get the global translation manager instance."""
    global _translation_manager
    if _translation_manager is None:
        _translation_manager = TranslationManager()
    return _translation_manager


def translate(message: str, locale: str = DEFAULT_LOCALE.value, **kwargs) -> str:
    """Convenience function for translation."""
    manager = get_translation_manager()
    return manager.translate(message, locale, **kwargs)
