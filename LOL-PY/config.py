import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Load environment variables and assign them to Config class
    Make sure to add the required environment variables to .env file
    """

    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = bool(
        os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS"))
    
    AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
    AWS_ACCESS_SECRET = os.environ.get("AWS_ACCESS_SECRET")
    AWS_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
    AWS_DOMAIN = os.environ.get("S3_BUCKET_BASE_URL")
