"""Internationalization configuration for the application."""

from enum import Enum
from typing import Dict
from pydantic import BaseModel


class SupportedLocale(str, Enum):
    """Supported locales enumeration."""
    AFRIKAANS = "af"
    ENGLISH_UK = "en_GB"
    GERMAN = "de"
    ROMANIAN = "ro"
    ZULU = "zu"
    SWISS_GERMAN = "gsw_CH"


class LocaleConfig(BaseModel):
    """Configuration for a specific locale."""
    name: str
    native_name: str
    direction: str = "ltr"
    region: str
    currency: str
    date_format: str
    time_format: str
    decimal_separator: str = "."
    thousands_separator: str = ","


# Locale configurations
LOCALE_CONFIGS: Dict[str, LocaleConfig] = {
    SupportedLocale.AFRIKAANS: LocaleConfig(
        name="Afrikaans",
        native_name="Afrikaans",
        region="ZA",
        currency="ZAR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator=" "
    ),
    SupportedLocale.ENGLISH_UK: LocaleConfig(
        name="English (UK)",
        native_name="English (UK)",
        region="GB",
        currency="GBP",
        date_format="%d/%m/%Y",
        time_format="%H:%M"
    ),
    SupportedLocale.GERMAN: LocaleConfig(
        name="German",
        native_name="Deutsch",
        region="DE",
        currency="EUR",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator="."
    ),
    SupportedLocale.ROMANIAN: LocaleConfig(
        name="Romanian",
        native_name="Română",
        region="RO",
        currency="RON",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator="."
    ),
    SupportedLocale.ZULU: LocaleConfig(
        name="isiZulu",
        native_name="isiZulu",
        region="ZA",
        currency="ZAR",
        date_format="%Y/%m/%d",
        time_format="%H:%M"
    ),
    SupportedLocale.SWISS_GERMAN: LocaleConfig(
        name="Swiss German (Zürich)",
        native_name="Züritüütsch",
        region="CH",
        currency="CHF",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=".",
        thousands_separator="'"
    )
}

DEFAULT_LOCALE = SupportedLocale.ENGLISH_UK
FALLBACK_LOCALE = SupportedLocale.ENGLISH_UK

# Translation domains
TRANSLATION_DOMAINS = [
    "messages",      # General messages
    "auth",          # Authentication
    "validation",    # Form validation
    "errors",        # Error messages
    "api",           # API responses
]
