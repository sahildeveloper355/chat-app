from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client['python-chatapp']
print("Database Connected")

collection = db['users']
chat_collection = db['chat']
message_collection = db['message']