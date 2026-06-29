from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DATABASE_NAME

client = AsyncIOMotorClient(
	MONGO_URI,
	serverSelectionTimeoutMS=5000,
	connectTimeoutMS=5000,
)

db = client[DATABASE_NAME]

users = db.users