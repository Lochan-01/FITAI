from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class WorkoutRequest(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    body_fat: float
    grip_force: float
    sit_bend: float
    situps: int
    broad_jump: float
    goal: str


class DietRequest(BaseModel):
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    goal: str


class HabitRequest(BaseModel):
    age: int
    gender: str
    heart_rate: float
    steps: int
    calories_burned: float
    distance_km: float
    activity_type: str
    sleep_hours: float
    resting_heart_rate: float
    hydration_level: float
    body_fat: float
    bmi: float
    workout_duration: float
    workout_intensity: int
    fatigue_score: float
    stress_level: float
    adherence_rate: float
    previous_injury: bool
    recovery_days: int
    training_load: float
    injury_risk: float
    fitness_level: str