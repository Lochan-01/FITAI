import math
from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "habit_model.pkl"
ENCODERS_PATH = BASE_DIR / "models" / "habit_encoders.pkl"

initialization_error = None
habit_model = None
habit_encoders = None

try:
    habit_model = joblib.load(MODEL_PATH)
    habit_encoders = joblib.load(ENCODERS_PATH)
except Exception as exc:
    initialization_error = f"Habit model initialization failed: {exc}"


def _normalize_gender(gender: str) -> str:
    normalized = str(gender).strip().lower()
    if normalized in {"male", "m"}:
        return "Male"
    if normalized in {"female", "f"}:
        return "Female"
    return gender.title()


def _encode_categorical(value: str, encoder) -> object:
    try:
        return encoder.transform([value])[0]
    except Exception:
        return value


def _fallback_encode_gender(value: str) -> int:
    v = str(value).strip().lower()
    if v in {"male", "m"}:
        return 0
    if v in {"female", "f"}:
        return 1
    return 2


def _fallback_encode_activity(value: str) -> int:
    v = str(value).strip().lower()
    mapping = {"walking": 0, "running": 1, "cycling": 2, "gym": 3, "other": 4}
    return mapping.get(v, 4)


def _fallback_encode_fitness(value: str) -> int:
    v = str(value).strip().lower()
    mapping = {"beginner": 0, "intermediate": 1, "advanced": 2}
    return mapping.get(v, 1)


def _compute_scores(data: Dict[str, object]) -> Dict[str, int]:
    wellness = 100
    recovery = 100
    consistency = 100

    wellness -= max(0, data["stress_level"] - 5) * 4
    wellness -= max(0, 7 - data["sleep_hours"]) * 3
    wellness -= max(0, 6.5 - data["hydration_level"]) * 3
    wellness += max(0, data["fitness_level_score"] - 2) * 2
    wellness = int(np.clip(wellness, 0, 100))

    recovery -= max(0, data["fatigue_score"] - 4) * 5
    recovery -= max(0, data["training_load"] - 7) * 3
    recovery += max(0, data["sleep_hours"] - 7) * 2
    recovery += max(0, 8 - data["injury_risk"]) * 2
    recovery = int(np.clip(recovery, 0, 100))

    consistency -= max(0, 6 - data["adherence_rate"]) * 5
    consistency -= max(0, data["stress_level"] - 6) * 3
    consistency += max(0, data["workout_duration"] - 20) * 1
    consistency += max(0, data["sleep_hours"] - 6) * 1
    consistency = int(np.clip(consistency, 0, 100))

    return {
        "wellness_score": wellness,
        "recovery_score": recovery,
        "consistency_score": consistency,
    }


def _build_insights(data: Dict[str, object]) -> List[str]:
    insights: List[str] = []

    if data["sleep_hours"] < 7:
        insights.append("Your sleep has decreased over the last few sessions.")
    else:
        insights.append("Your sleep is supporting better recovery.")

    if data["fatigue_score"] > 6:
        insights.append("High fatigue is affecting workout consistency.")
    if data["hydration_level"] < 6.5:
        insights.append("Hydration levels are below the recommended range.")
    if data["training_load"] > 8:
        insights.append("Your training load is becoming excessive.")
    if data["recovery_days"] >= 2 and data["fatigue_score"] <= 4:
        insights.append("Excellent recovery trend detected.")
    if data["stress_level"] > 6:
        insights.append("Stress levels may reduce workout adherence.")
    if data["adherence_rate"] >= 0.8:
        insights.append("Your routine consistency is very strong.")

    return insights[:5]


def _select_recommendations(data: Dict[str, object]) -> List[str]:
    recs: List[str] = []

    if data["sleep_hours"] < 7:
        recs.append("Increase sleep")
    if data["hydration_level"] < 7:
        recs.append("Drink more water")
    if data["training_load"] > 8:
        recs.append("Reduce training load")
    if data["fatigue_score"] > 6:
        recs.append("Take a recovery day")
    if data["workout_intensity"] > 7:
        recs.append("Lower workout intensity")
    if data["adherence_rate"] >= 0.8:
        recs.append("Maintain consistency")

    if not recs:
        recs.append("Keep monitoring your recovery and routine.")

    return recs[:4]


def _select_motivation(skip_risk: str, adherence_score: float) -> str:
    if skip_risk == "Low":
        return "Excellent consistency! Keep maintaining your routine."
    if skip_risk == "Medium":
        return "You're losing momentum. Try a shorter workout today."
    return "You are likely to skip your next workout. A 20-minute session today will help maintain your streak."


def predict_habit(
    age: int,
    gender: str,
    heart_rate: float,
    steps: int,
    calories_burned: float,
    distance_km: float,
    activity_type: str,
    sleep_hours: float,
    resting_heart_rate: float,
    hydration_level: float,
    body_fat: float,
    bmi: float,
    workout_duration: float,
    workout_intensity: int,
    fatigue_score: float,
    stress_level: float,
    adherence_rate: float,
    previous_injury: bool,
    recovery_days: int,
    training_load: float,
    injury_risk: float,
    fitness_level: str,
) -> Dict[str, object]:
    if initialization_error:
        raise ValueError(initialization_error)
    if habit_model is None or habit_encoders is None:
        raise ValueError("Habit prediction models are unavailable.")

    if not 0 <= adherence_rate <= 1:
        raise ValueError("adherence_rate must be between 0 and 1.")

    gender_norm = _normalize_gender(gender)
    # encode categorical features using provided encoders when available
    gender_enc = _encode_categorical(gender_norm, habit_encoders.get("gender_encoder"))
    activity_type_enc = _encode_categorical(activity_type, habit_encoders.get("activity_type_encoder"))
    fitness_level_enc = _encode_categorical(fitness_level, habit_encoders.get("fitness_level_encoder"))

    if isinstance(gender_enc, str):
        gender_enc = _fallback_encode_gender(gender_enc)
    if isinstance(activity_type_enc, str):
        activity_type_enc = _fallback_encode_activity(activity_type_enc)
    if isinstance(fitness_level_enc, str):
        fitness_level_enc = _fallback_encode_fitness(fitness_level_enc)

    sample = pd.DataFrame([
        {
            "age": age,
            "gender": gender_enc,
            "heart_rate": heart_rate,
            "steps": steps,
            "calories_burned": calories_burned,
            "distance_km": distance_km,
            "activity_type": activity_type_enc,
            "sleep_hours": sleep_hours,
            "resting_heart_rate": resting_heart_rate,
            "hydration_level": hydration_level,
            "body_fat": body_fat,
            "bmi": bmi,
            "workout_duration": workout_duration,
            "workout_intensity": workout_intensity,
            "fatigue_score": fatigue_score,
            "stress_level": stress_level,
            "adherence_rate": adherence_rate,
            "previous_injury": int(previous_injury),
            "recovery_days": recovery_days,
            "training_load": training_load,
            "injury_risk": injury_risk,
            "fitness_level": fitness_level_enc,
        }
    ])

    numeric_cols = [
        "age",
        "gender",
        "heart_rate",
        "steps",
        "calories_burned",
        "distance_km",
        "activity_type",
        "sleep_hours",
        "resting_heart_rate",
        "hydration_level",
        "body_fat",
        "bmi",
        "workout_duration",
        "workout_intensity",
        "fatigue_score",
        "stress_level",
        "adherence_rate",
        "previous_injury",
        "recovery_days",
        "training_load",
        "injury_risk",
        "fitness_level",
    ]

    for col in numeric_cols:
        if col in sample.columns:
            sample[col] = pd.to_numeric(sample[col], errors="coerce")

    sample = sample.fillna({
        "heart_rate": 72.0,
        "steps": 0,
        "calories_burned": 0.0,
        "distance_km": 0.0,
        "sleep_hours": 7.0,
        "resting_heart_rate": 60.0,
        "hydration_level": 5.0,
        "body_fat": 20.0,
        "bmi": 25.0,
        "workout_duration": 0.0,
        "workout_intensity": 2,
        "fatigue_score": 0.0,
        "stress_level": 0.0,
        "adherence_rate": 0.0,
        "previous_injury": 0,
        "recovery_days": 0,
        "training_load": 0.0,
        "injury_risk": 0.01,
        "gender": _fallback_encode_gender(gender_norm),
        "activity_type": _fallback_encode_activity(activity_type),
        "fitness_level": _fallback_encode_fitness(fitness_level),
    })

    prediction_prob = habit_model.predict_proba(sample)
    if prediction_prob.shape[1] == 1:
        confidence = float(prediction_prob[0][0] * 100)
    else:
        confidence = float(np.max(prediction_prob[0]) * 100)

    score = float(habit_model.predict(sample)[0])
    adherence_score = int(np.clip(round(score), 0, 100))

    if adherence_score >= 80:
        skip_risk = "Low"
    elif adherence_score >= 50:
        skip_risk = "Medium"
    else:
        skip_risk = "High"

    habit_insights = _build_insights({
        "sleep_hours": sleep_hours,
        "fatigue_score": fatigue_score,
        "hydration_level": hydration_level,
        "training_load": training_load,
        "recovery_days": recovery_days,
        "stress_level": stress_level,
        "adherence_rate": adherence_rate,
        "fitness_level_score": habit_encoders.get("fitness_level_score", 0),
        "workout_duration": workout_duration,
    })

    scores = _compute_scores({
        "stress_level": stress_level,
        "sleep_hours": sleep_hours,
        "hydration_level": hydration_level,
        "fitness_level_score": habit_encoders.get("fitness_level_score", 0),
        "fatigue_score": fatigue_score,
        "training_load": training_load,
        "adherence_rate": adherence_rate * 100,
        "workout_duration": workout_duration,
        "injury_risk": injury_risk,
    })

    recommendations = _select_recommendations({
        "sleep_hours": sleep_hours,
        "hydration_level": hydration_level,
        "training_load": training_load,
        "fatigue_score": fatigue_score,
        "workout_intensity": workout_intensity,
        "adherence_rate": adherence_rate,
    })

    return {
        "adherence_score": adherence_score,
        "skip_risk": skip_risk,
        "confidence": round(confidence, 1),
        "motivation": _select_motivation(skip_risk, adherence_score),
        "recommendations": recommendations,
        "habit_insights": habit_insights,
        **scores,
    }
