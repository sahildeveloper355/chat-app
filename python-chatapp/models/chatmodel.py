from pydantic import BaseModel,Field
from models.messagemodel import Message
from typing import List

class Chat(BaseModel):
    sender: str
    receiver: str
    messages: List[Message]
