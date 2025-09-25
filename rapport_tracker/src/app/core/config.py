import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""
    ENVIRONMENT: Literal["development", "production", "testing"] = os.getenv("ENVIRONMENT", "development")

    # Database URLs (loaded from .env)
    # Production: postgresql+asyncpg://user:password@host/db
    DATABASE_URL_PROD: str
    # Testing: sqlite+aiosqlite:///:memory:
    DATABASE_URL_TEST: str = "sqlite+aiosqlite:///:memory:"

    @property
    def async_database_url(self) -> str:
        """Returns the appropriate database URL based on the environment."""
        if self.ENVIRONMENT == "testing":
            return self.DATABASE_URL_TEST
        return self.DATABASE_URL_PROD

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()