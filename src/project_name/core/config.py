"""Application configuration settings.

This module contains all configuration settings for the application,
using Pydantic Settings for validation and environment variable support.
"""

import secrets

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    # Application Settings
    PROJECT_NAME: str = "project-name"
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1"]

    # Database Settings
    DATABASE_URL: PostgresDsn | None = None
    DATABASE_BACKEND: str = "postgresql"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "project_db"

    # Test Database
    TEST_DATABASE_URL: PostgresDsn | None = None

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0

    # Authentication & Security
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Email Settings (Optional)
    SMTP_HOST: str | None = None
    SMTP_PORT: int | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: EmailStr | None = None
    EMAILS_FROM_NAME: str | None = None

    # External Services
    SENTRY_DSN: HttpUrl | None = None

    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # API Settings
    RATE_LIMIT_PER_MINUTE: int = 60
    ENABLE_DOCS: bool = True
    ENABLE_REDOC: bool = True

    # Internationalization Settings
    DEFAULT_LOCALE: str = "en_GB"
    SUPPORTED_LOCALES: list[str] = ["af", "en_GB", "de", "ro", "zu", "gsw_CH"]
    LOCALE_DETECTION_SOURCES: list[str] = ["path", "query", "header", "accept_language"]
    TRANSLATION_CACHE_TTL: int = 3600  # 1 hour
    ENABLE_LOCALE_FALLBACK: bool = True
    LOCALE_COOKIE_NAME: str = "locale"
    LOCALE_COOKIE_MAX_AGE: int = 31536000  # 1 year

    # Translation file paths
    TRANSLATION_DIR: str = "src/project_name/i18n/locales"
    TRANSLATION_DOMAIN: str = "messages"

    # CORS Settings
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        """Parse CORS origins from environment variable."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @property
    def database_url(self) -> str:
        """Construct database URL from components."""
        if self.DATABASE_URL:
            return str(self.DATABASE_URL)

        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def test_database_url(self) -> str:
        """Construct test database URL."""
        if self.TEST_DATABASE_URL:
            return str(self.TEST_DATABASE_URL)

        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}_test"
        )

    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.ENVIRONMENT.lower() == "development"

    @property
    def is_testing(self) -> bool:
        """Check if running in testing environment."""
        return self.ENVIRONMENT.lower() == "testing"


# Global settings instance
settings = Settings()
