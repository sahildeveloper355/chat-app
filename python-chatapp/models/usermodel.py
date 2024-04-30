from pydantic import BaseModel

class Userregister(BaseModel):
    firstname: str
    lastname: str
    email: str
    username: str
    password: str

class Userlogin(BaseModel):
    username: str
    password: str


