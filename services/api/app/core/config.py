from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Khetha AI API"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://khetha:khetha_dev@localhost:5432/khetha"
    allowed_origins: str = "http://localhost:8081,http://localhost:19006"
    content_source_mode: str = "demo"
    oidc_issuer_url: str = ""
    oidc_audience: str = ""
    ncap_api_base_url: str = ""
    ncap_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def is_development(self) -> bool:
        return self.app_env in {"development", "test"}


@lru_cache
def get_settings() -> Settings:
    return Settings()

