from lib2to3.pytree import Base
from pydantic import BaseModel

class UploadRequest(BaseModel):
    item_s3_key: str
    doc_uuid: str