from lib2to3.pytree import Base
from pydantic import BaseSettings

# Config for the project - reference https://fastapi.tiangolo.com/advanced/settings/#pydantic-settings 

class Settings(BaseSettings):
    env: str = "DEV"
    faiss_index_path = "./cupid_ai/db/index.faiss"
    faiss_config_path = "./cupid_ai/db/index.json"

    # For future expansion - when there are secrets that we don't want to commit, we can load them from env 
    # class Config:
    #     env_file = ".env"


settings = Settings()