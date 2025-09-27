from typing import Literal, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""
    ENVIRONMENT: Literal["development", "production", "testing"] = "development"

    # Database URLs (loaded from .env)
    # Production: postgresql+asyncpg://user:password@host/db
    DATABASE_URL_PROD: Optional[str] = None
    # Testing: sqlite+aiosqlite:///:memory:
    DATABASE_URL_TEST: str = "sqlite+aiosqlite:///:memory:"
    # Development fallback
    DATABASE_URL_DEV: str = "sqlite+aiosqlite:///./collaboration_bridge_dev.db"

    @property
    def async_database_url(self) -> str:
        """Returns the appropriate database URL based on the environment."""
        if self.ENVIRONMENT == "testing":
            return self.DATABASE_URL_TEST
        elif self.ENVIRONMENT == "production":
            if not self.DATABASE_URL_PROD:
                raise ValueError("DATABASE_URL_PROD is required for production environment")
            return self.DATABASE_URL_PROD
        else:
            # Development environment
            return self.DATABASE_URL_DEV

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
