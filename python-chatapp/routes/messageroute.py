import os
from datetime import datetime
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from config.db import message_collection
import aiofiles
from fastapi.encoders import jsonable_encoder
from models.messagemodel import Message
from bson import ObjectId
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient


messagerouter = APIRouter()

# Send Message
@messagerouter.post("/send")
async def upload_file(sender: str = Form(...), receiver: str = Form(...), message: str = Form(...),
                      file: UploadFile = File(None)):
    try:
        file_metadata = {}
        if file and file.filename:
            upload_dir = "upload"
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)

            filename = f"{file.filename.split('.')[0]}-{datetime.now().timestamp()}.{file.filename.split('.')[-1]}"
            file_path = os.path.join(os.getcwd(), upload_dir, filename)

            async with aiofiles.open(file_path, "wb") as buffer:
                while True:
                    data = await file.read(1024)
                    if not data:
                        break
                    await buffer.write(data)

            file_metadata = {
                "filename": file.filename,
                "filetype": file.content_type,
                "fileurl": file_path,
            }

        new_message = {
            "sender": sender,
            "receiver": receiver,
            "message": message,
            "file": file_metadata if file_metadata else None,
        }
        result = message_collection.insert_one(new_message)
        inserted_id = result.inserted_id

        saved_message = message_collection.find_one({"_id": inserted_id})
        return jsonable_encoder(message, custom_encoder={ObjectId: saved_message})

    except HTTPException as http_exception:
        raise http_exception
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get Message
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["python-chatapp"]
message_collection = db["message"]


@messagerouter.get("/receiver/{receiver}")
async def get_receiver_messages(receiver: str):
    try:
        receiver = ObjectId(receiver)

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid receiver format")

    cursor = message_collection.find({"receiver": receiver})
    messages = []
    print(messages)
    async for message in cursor:
        messages.append(message)

    if not messages:
        raise HTTPException(status_code=404, detail="Receiver not found")
    return messages
