import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TruthLens AI"
    API_V1_STR: str = "/api/v1"
    
    # Environment configs
    DATABASE_URL: str = "postgresql://truthlens_admin:truthlens_password@localhost:5432/truthlens_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT configs
    JWT_SECRET: str = "supersecretjwtkeyfortruthlensai2026!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Model config
    DEFAULT_TRANSFORMER_MODEL: str = "mrm8488/bert-tiny-finetuned-fake-news"
    
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
