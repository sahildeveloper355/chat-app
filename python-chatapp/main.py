from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import dotenv_values
from contextlib import asynccontextmanager
from routes.userroute import router
from routes.chatroute import chatrouter
from routes.messageroute import messagerouter
from test import webrouter

config = dotenv_values(".env")

app = FastAPI()
app.include_router(router)
app.include_router(chatrouter)
app.include_router(messagerouter)
app.include_router(webrouter)


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    mongodb_client = MongoClient(config["MONGODB_URI"])
    app.mongodb_client = mongodb_client
    app.database = mongodb_client[config["DB_NAME"]]
    yield
    mongodb_client.close()


app.lifespan = app_lifespan
