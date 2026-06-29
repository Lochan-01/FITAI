from fastapi import APIRouter
from app.schemas import DietRequest
from app.ai.diet_model import recommend_diet

router = APIRouter(prefix="/diet", tags=["Diet"])


@router.post("/recommend")
def get_diet_plan(data: DietRequest):
    return recommend_diet(
        age=data.age,
        gender=data.gender,
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        goal=data.goal,
    )