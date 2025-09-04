"""Internationalization configuration for the application."""

from enum import Enum

from pydantic import BaseModel


class SupportedLocale(str, Enum):
    """Supported locales enumeration."""

    AFRIKAANS = "af"
    ENGLISH_UK = "en_GB"
    GERMAN = "de"
    ROMANIAN = "ro"
    ZULU = "zu"
    SWISS_GERMAN = "gsw_CH"
    CHINESE_SIMPLIFIED = "zh"
    HINDI = "hi"
    SPANISH = "es"
    ARABIC = "ar"
    FRENCH = "fr"
    BENGALI = "bn"
    PORTUGUESE = "pt"
    RUSSIAN = "ru"
    INDONESIAN = "id"


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
LOCALE_CONFIGS: dict[str, LocaleConfig] = {
    SupportedLocale.AFRIKAANS: LocaleConfig(
        name="Afrikaans",
        native_name="Afrikaans",
        region="ZA",
        currency="ZAR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator=" ",
    ),
    SupportedLocale.ENGLISH_UK: LocaleConfig(
        name="English (UK)",
        native_name="English (UK)",
        region="GB",
        currency="GBP",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.GERMAN: LocaleConfig(
        name="German",
        native_name="Deutsch",
        region="DE",
        currency="EUR",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator=".",
    ),
    SupportedLocale.ROMANIAN: LocaleConfig(
        name="Romanian",
        native_name="Română",
        region="RO",
        currency="RON",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=",",
        thousands_separator=".",
    ),
    SupportedLocale.ZULU: LocaleConfig(
        name="isiZulu",
        native_name="isiZulu",
        region="ZA",
        currency="ZAR",
        date_format="%Y/%m/%d",
        time_format="%H:%M",
    ),
    SupportedLocale.SWISS_GERMAN: LocaleConfig(
        name="Swiss German (Zürich)",
        native_name="Züritüütsch",
        region="CH",
        currency="CHF",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
        decimal_separator=".",
        thousands_separator="'",
    ),
    SupportedLocale.CHINESE_SIMPLIFIED: LocaleConfig(
        name="Chinese (Simplified)",
        native_name="简体中文",
        direction="ltr",
        region="CN",
        currency="CNY",
        date_format="%Y-%m-%d",
        time_format="%H:%M",
    ),
    SupportedLocale.HINDI: LocaleConfig(
        name="Hindi",
        native_name="हिन्दी",
        direction="ltr",
        region="IN",
        currency="INR",
        date_format="%d-%m-%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.SPANISH: LocaleConfig(
        name="Spanish",
        native_name="Español",
        direction="ltr",
        region="ES",
        currency="EUR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.ARABIC: LocaleConfig(
        name="Arabic",
        native_name="العربية",
        direction="rtl",
        region="SA",
        currency="SAR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.FRENCH: LocaleConfig(
        name="French",
        native_name="Français",
        direction="ltr",
        region="FR",
        currency="EUR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.BENGALI: LocaleConfig(
        name="Bengali",
        native_name="বাংলা",
        direction="ltr",
        region="BD",
        currency="BDT",
        date_format="%d-%m-%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.PORTUGUESE: LocaleConfig(
        name="Portuguese",
        native_name="Português",
        direction="ltr",
        region="PT",
        currency="EUR",
        date_format="%d-%m-%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.RUSSIAN: LocaleConfig(
        name="Russian",
        native_name="Русский",
        direction="ltr",
        region="RU",
        currency="RUB",
        date_format="%d.%m.%Y",
        time_format="%H:%M",
    ),
    SupportedLocale.INDONESIAN: LocaleConfig(
        name="Indonesian",
        native_name="Bahasa Indonesia",
        direction="ltr",
        region="ID",
        currency="IDR",
        date_format="%d/%m/%Y",
        time_format="%H:%M",
    ),
}

DEFAULT_LOCALE = SupportedLocale.ENGLISH_UK
FALLBACK_LOCALE = SupportedLocale.ENGLISH_UK

# Translation domains
TRANSLATION_DOMAINS = [
    "messages",  # General messages
    "auth",  # Authentication
    "validation",  # Form validation
    "errors",  # Error messages
    "api",  # API responses
]
