import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
JWT_SECRET = os.getenv("JWT_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")