from fastapi import FastAPI, HTTPException, status
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr
from models.usermodel import Userregister , Userlogin
from config.db import collection
from fastapi import APIRouter
import bcrypt
from fastapi.encoders import jsonable_encoder

router = APIRouter()

# Register Route
@router.post("/register")
def register(user: Userregister):
    if collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email is already Exist..!")
    if collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username is already Exist..!")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    user_dict = user.dict()
    user_dict['password'] = hashed_password

    new_user_result = collection.insert_one(user_dict)

    created_user_id = new_user_result.inserted_id
    created_user = collection.find_one({"id": created_user_id})
    if created_user:
        created_user.pop("password", None)
    return {"message": f"{user.username} Register successful..!"}


# Login Route
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
@router.post("/login")
def login(user: Userlogin):
    try:
        if not user.username or not user.password:
            raise HTTPException(status_code=400, detail="Username and password are required")

        user_data = collection.find_one({"username": user.username})
        if not user_data:
            raise HTTPException(status_code=400, detail="Invalid username")

        if not pwd_context.verify(user.password, user_data["password"]):
            raise HTTPException(status_code=400, detail="Invalid password")

        return {"message": f"{user.username} Login successful..!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

