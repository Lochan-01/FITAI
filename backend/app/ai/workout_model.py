import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

fitness_model = joblib.load(BASE_DIR / "models" / "fitness_level_model.pkl")
gender_encoder = joblib.load(BASE_DIR / "models" / "gender_encoder.pkl")
class_encoder = joblib.load(BASE_DIR / "models" / "class_encoder.pkl")
workout_db = joblib.load(BASE_DIR / "models" / "workout_database.pkl")


def _normalize_gender(gender):
    normalized = str(gender).strip().upper()

    if normalized in {"MALE", "M"}:
        return "M"

    if normalized in {"FEMALE", "F"}:
        return "F"

    return normalized


def recommend_workout(
    age,
    gender,
    height_cm,
    weight_kg,
    body_fat,
    grip_force,
    sit_bend,
    situps,
    broad_jump,
    goal
):

    bmi = weight_kg / ((height_cm / 100) ** 2)

    gender = gender_encoder.transform([_normalize_gender(gender)])[0]

    sample = pd.DataFrame({
        "age":[age],
        "gender":[gender],
        "height_cm":[height_cm],
        "weight_kg":[weight_kg],
        "BMI":[bmi],
        "body fat_%":[body_fat],
        "gripForce":[grip_force],
        "sit and bend forward_cm":[sit_bend],
        "sit-ups counts":[situps],
        "broad jump_cm":[broad_jump]
    })

    prediction = fitness_model.predict(sample)

    fitness_level = class_encoder.inverse_transform(prediction)[0]

    workouts = workout_db[
        (workout_db["goal"] == goal) &
        (workout_db["fitness_level"] == fitness_level)
    ]

    if len(workouts) == 0:
        workouts = workout_db[workout_db["fitness_level"] == fitness_level]

    workouts = (
        workouts
        .drop_duplicates(subset=["exercise_name"])
        .head(8)
        .copy()
    )

    return {
        "fitness_level": fitness_level,
        "recommendation_count": int(len(workouts)),
        "workouts": workouts[
            [
                "exercise_name",
                "sets",
                "reps",
                "intensity",
                "equipment"
            ]
        ].to_dict(orient="records")
    }