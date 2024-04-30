from typing import Optional
from pydantic import BaseModel

class File(BaseModel):
    filename: str
    filetype: str
    fileurl: str

class Message(BaseModel):
    sender: Optional[str] = None
    receiver: Optional[str] = None
    message: str
    file: Optional[File] = None

    class Config:
        extra = 'allow'
