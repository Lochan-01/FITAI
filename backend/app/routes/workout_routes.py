from fastapi import APIRouter
from app.schemas import WorkoutRequest
from app.ai.workout_model import recommend_workout

router = APIRouter(prefix="/workout", tags=["Workout"])


@router.post("/recommend")
def get_workout(data: WorkoutRequest):

    result = recommend_workout(
        age=data.age,
        gender=data.gender,
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        body_fat=data.body_fat,
        grip_force=data.grip_force,
        sit_bend=data.sit_bend,
        situps=data.situps,
        broad_jump=data.broad_jump,
        goal=data.goal
    )

    return result