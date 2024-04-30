from fastapi import APIRouter , HTTPException , status
from models.chatmodel import Chat
from config.db import chat_collection
from fastapi.encoders import jsonable_encoder

chatrouter = APIRouter()

# CereateChat
@chatrouter.post("/create", response_model=None)
def create_chat(chat: Chat):
    sender = chat.sender
    receiver = chat.receiver
    try:
        existing_chat = chat_collection.find_one({"sender": sender, "receiver": receiver})
        if existing_chat:
            updated_messages = existing_chat.get('messages', [])
            for message in chat.messages:
                updated_messages.append({"message": message.message, "file": message.file})
            chat_collection.update_one({"_id": existing_chat["_id"]}, {"$set": {"messages": updated_messages}})
            existing_chat['messages'] = updated_messages
            return jsonable_encoder(Chat(**existing_chat))

        else:
            new_messages = [{"message": msg.message, "file": msg.file} for msg in chat.messages]
            new_chat = {
                "sender": sender,
                "receiver": receiver,
                "messages": new_messages
            }
            result = chat_collection.insert_one(new_chat)
            new_chat['_id'] = result.inserted_id
            return Chat(**new_chat)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

