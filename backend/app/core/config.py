from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Jan Awaaz Ai"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    GEMINI_API_KEY: str
    GOOGLE_APPLICATION_CREDENTIALS: str
    NGROK_AUTHTOKEN: str

    # No default here on purpose: the app must fail to start rather than
    # silently sign JWTs with a publicly-known key from GitHub history.
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    GCP_PROJECT_ID: str = ""
    FIREBASE_PROJECT_ID: str = "jan-awaaz-ai-authentication"
    PUBSUB_TOPIC_ID: str = ""
    GCS_BUCKET_NAME: str = ""

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    ALLOWED_HOSTS: List[str] = ["*"]

    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()