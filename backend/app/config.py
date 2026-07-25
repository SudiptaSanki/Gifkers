import os

class Settings:
    PROJECT_NAME: str = "Python Sticker Generator API"
    VERSION: str = "1.0.0"
    CORS_ORIGINS: list = ["*"]
    EXECUTION_TIMEOUT_SECONDS: int = 15
    MAX_MEMORY_MB: int = 512

settings = Settings()
