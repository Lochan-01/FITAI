from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.chatbot import get_gemini_reply

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str


@router.post("/ask")
async def ask_chatbot(request: ChatRequest):
    reply = get_gemini_reply(request.message)
    return {"reply": reply}
