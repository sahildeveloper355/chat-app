# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
# from typing import List
# import uvicorn
# import asyncio
#
# webrouter = APIRouter()
#
#
# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []
#         self.lock = asyncio.Lock()
#
#     async def connect(self, websocket: WebSocket):
#         async with self.lock:
#             await websocket.accept()
#             self.active_connections.append(websocket)
#
#     async def disconnect(self, websocket: WebSocket):
#         async with self.lock:
#             self.active_connections.remove(websocket)
#
#     async def broadcast(self, message: str):
#         async with self.lock:
#             for connection in self.active_connections:
#                 await connection.send_text(message)
#
# manager = ConnectionManager()
#
# @webrouter.websocket("/ws/{client_id}")
# async def websocket(websocket: WebSocket, client_id: int):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             print(data)
#             await manager.broadcast(f"Client #{client_id} says: {data}")
#     except WebSocketDisconnect:
#         await manager.disconnect(websocket)
#         await manager.broadcast(f"Client #{client_id} left the chat")
#     except Exception as e:
#         await manager.disconnect(websocket)
#         print(f"Error: {e}")
#
#
# if __name__ == "__main__":
#     uvicorn.run(host="0.0.0.0", port=8000)


from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from datetime import datetime
from models.chatmodel import Chat
from config.db import chat_collection

app = FastAPI()
webrouter = APIRouter()

chat_history = []

@webrouter.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            messages_data = await websocket.receive_json()
            print('Received message:', messages_data)
            new_messages = Chat(**messages_data, timestamp=datetime.now())
            chat_history.append(new_messages.dict())
            await chat_collection.insert_one(new_messages.dict())
            await websocket.send_json({"message": new_messages.dict()})
            print('Message saved to database:', new_messages)
    except WebSocketDisconnect:
        print(f"WebSocket disconnected")
    except Exception as e:
        print(f"Error: {e}")

app.include_router(webrouter)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

