from fastapi import APIRouter, HTTPException
from app.schemas import HabitRequest
from app.ai.habit_model import predict_habit, initialization_error

router = APIRouter(prefix="/habit", tags=["Habit"])


@router.post("/predict")
def get_habit_prediction(data: HabitRequest):
    if initialization_error:
        raise HTTPException(status_code=500, detail=initialization_error)

    try:
        return predict_habit(
            age=data.age,
            gender=data.gender,
            heart_rate=data.heart_rate,
            steps=data.steps,
            calories_burned=data.calories_burned,
            distance_km=data.distance_km,
            activity_type=data.activity_type,
            sleep_hours=data.sleep_hours,
            resting_heart_rate=data.resting_heart_rate,
            hydration_level=data.hydration_level,
            body_fat=data.body_fat,
            bmi=data.bmi,
            workout_duration=data.workout_duration,
            workout_intensity=data.workout_intensity,
            fatigue_score=data.fatigue_score,
            stress_level=data.stress_level,
            adherence_rate=data.adherence_rate,
            previous_injury=data.previous_injury,
            recovery_days=data.recovery_days,
            training_load=data.training_load,
            injury_risk=data.injury_risk,
            fitness_level=data.fitness_level,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Habit prediction failed: {exc}")
