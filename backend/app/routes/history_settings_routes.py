import time
from typing import Dict, List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["History & Settings"])


class HistoryEntry(BaseModel):
    id: int | None = None
    title: str
    time: str = "Just now"
    status: str
    details: str
    icon: str = "workout"
    color: str = "text-cyan-400"


class SettingsPayload(BaseModel):
    displayName: str
    fitnessGoal: str
    dailyCalories: str
    proteinTarget: str
    workoutReminders: bool
    mealReminders: bool
    hideProgress: bool
    twoStepLogin: bool


history_entries: List[Dict] = [
    {
        "id": 1,
        "title": "Chest + Triceps",
        "time": "Today · 6:30 AM",
        "status": "Completed",
        "details": "4 exercises, 18 total sets, strong final push on incline presses.",
        "icon": "workout",
        "color": "text-cyan-400",
    },
    {
        "id": 2,
        "title": "Meal prep review",
        "time": "Yesterday · 8:15 PM",
        "status": "Logged",
        "details": "Protein target hit with balanced carbs and low sugar intake.",
        "icon": "meal",
        "color": "text-emerald-400",
    },
    {
        "id": 3,
        "title": "Mobility session",
        "time": "Mon · 7:00 AM",
        "status": "Completed",
        "details": "15 minutes of joint mobility and shoulder stability work.",
        "icon": "recovery",
        "color": "text-pink-400",
    },
]

settings_data: Dict = {
    "displayName": "FitAI User",
    "fitnessGoal": "Build strength + endurance",
    "dailyCalories": "2200",
    "proteinTarget": "150",
    "workoutReminders": True,
    "mealReminders": True,
    "hideProgress": False,
    "twoStepLogin": False,
}


@router.get("/history")
async def get_history():
    return {"history": history_entries}


@router.post("/history")
async def add_history(entry: HistoryEntry):
    data = entry.model_dump() if hasattr(entry, "model_dump") else entry.dict()
    data.setdefault("id", int(time.time() * 1000))
    history_entries.insert(0, data)
    return {"history": history_entries}


@router.get("/settings")
async def get_settings():
    return {"settings": settings_data}


@router.post("/settings")
async def save_settings(payload: SettingsPayload):
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    settings_data.update(data)
    return {"settings": settings_data}
