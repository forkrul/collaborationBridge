"""Internationalization API endpoints."""

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from src.project_name.i18n.config import LOCALE_CONFIGS, SupportedLocale
from src.project_name.i18n.manager import get_translation_manager, translate

router = APIRouter()


class TranslationRequest(BaseModel):
    """Request model for translation."""

    key: str
    locale: str | None = None
    variables: dict[str, str] | None = None


class TranslationResponse(BaseModel):
    """Response model for translation."""

    key: str
    translation: str
    locale: str


class LocaleInfo(BaseModel):
    """Locale information model."""

    code: str
    name: str
    native_name: str
    direction: str
    region: str
    currency: str
    date_format: str
    time_format: str


def get_current_locale(
    accept_language: str | None = Header(None, alias="Accept-Language"),
    x_locale: str | None = Header(None, alias="X-Locale"),
) -> str:
    """Extract current locale from request headers."""
    # Check custom header first
    if x_locale and x_locale in [loc.value for loc in SupportedLocale]:
        return x_locale

    # Parse Accept-Language header
    if accept_language:
        # Simple parsing - in production you'd use a proper parser
        languages = accept_language.split(",")
        for lang in languages:
            lang_code = lang.split(";")[0].strip().replace("-", "_")
            if lang_code in [loc.value for loc in SupportedLocale]:
                return lang_code

    # Default to English UK
    return SupportedLocale.ENGLISH_UK.value


@router.get("/locales", response_model=list[LocaleInfo])
async def get_supported_locales():
    """Get list of supported locales."""
    return [
        LocaleInfo(
            code=locale.value,
            name=config.name,
            native_name=config.native_name,
            direction=config.direction,
            region=config.region,
            currency=config.currency,
            date_format=config.date_format,
            time_format=config.time_format,
        )
        for locale, config in LOCALE_CONFIGS.items()
    ]


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(
    request: TranslationRequest, current_locale: str = Depends(get_current_locale)
):
    """Translate a text key to specified locale."""
    target_locale = request.locale or current_locale

    if target_locale not in [locale.value for locale in SupportedLocale]:
        raise HTTPException(
            status_code=400, detail=f"Unsupported locale: {target_locale}"
        )

    variables = request.variables or {}
    translation = translate(request.key, target_locale, **variables)

    return TranslationResponse(
        key=request.key, translation=translation, locale=target_locale
    )


@router.get("/format/datetime")
async def format_datetime_endpoint(
    datetime_str: str,
    locale: str = Depends(get_current_locale),
    format_type: str = "medium",
):
    """Format datetime according to locale."""
    from datetime import datetime

    try:
        dt = datetime.fromisoformat(datetime_str.replace("Z", "+00:00"))
        manager = get_translation_manager()
        formatted = manager.format_datetime(dt, locale, format_type)
        return {"formatted": formatted, "locale": locale}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid datetime: {e}")


@router.get("/format/currency")
async def format_currency_endpoint(
    amount: float,
    locale: str = Depends(get_current_locale),
    currency: str | None = None,
):
    """Format currency according to locale."""
    manager = get_translation_manager()
    formatted = manager.format_currency(amount, locale, currency)
    return {"formatted": formatted, "locale": locale, "amount": amount}
