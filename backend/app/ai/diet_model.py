import joblib
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "diet_database.pkl"

diet_db = joblib.load(MODEL_PATH)


def _normalize_goal(goal):
    normalized = str(goal).strip().lower().replace("_", " ")

    mapping = {
        "weight loss": "Weight Loss",
        "maintain": "Maintain",
        "muscle gain": "Muscle Gain",
    }

    return mapping.get(normalized, str(goal).strip())


def _normalize_gender(gender):
    normalized = str(gender).strip().upper()

    if normalized in {"MALE", "M"}:
        return "M"

    if normalized in {"FEMALE", "F"}:
        return "F"

    return normalized


def _estimate_daily_calories(age, gender, height_cm, weight_kg, goal):
    if _normalize_gender(gender) == "M":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161

    activity_factor = 1.35
    goal_adjustment = {
        "Weight Loss": -350,
        "Maintain": 0,
        "Muscle Gain": 250,
    }.get(_normalize_goal(goal), 0)

    return max(1200, int(round((bmr * activity_factor) + goal_adjustment)))


def _serialize_recipe(recipe_row):
    ingredients = recipe_row.get("RecipeIngredientParts", "")
    if pd.isna(ingredients):
        ingredients = ""
    elif not isinstance(ingredients, str):
        ingredients = str(ingredients)

    return {
        "name": recipe_row.get("Name", "Recipe"),
        "calories": round(float(recipe_row.get("Calories", 0)), 1),
        "protein": round(float(recipe_row.get("ProteinContent", 0)), 1),
        "carbs": round(float(recipe_row.get("CarbohydrateContent", 0)), 1),
        "fat": round(float(recipe_row.get("FatContent", 0)), 1),
        "fiber": round(float(recipe_row.get("FiberContent", 0)), 1),
        "ingredients": ingredients,
    }


def recommend_diet(age, gender, height_cm, weight_kg, goal):
    """Build a daily meal plan for the given user profile and fitness goal."""
    normalized_goal = _normalize_goal(goal)
    estimated_daily_calories = _estimate_daily_calories(
        age=age,
        gender=gender,
        height_cm=height_cm,
        weight_kg=weight_kg,
        goal=normalized_goal,
    )

    meal_targets = {
        "Breakfast": 0.25,
        "Lunch": 0.30,
        "Dinner": 0.35,
        "Snack": 0.10,
    }

    meal_plans = []

    for meal_name, share in meal_targets.items():
        target_calories = estimated_daily_calories * share

        meal_df = diet_db[
            (diet_db["Goal"] == normalized_goal) &
            (diet_db["Meal"] == meal_name)
        ].copy()

        if meal_df.empty:
            meal_df = diet_db[diet_db["Meal"] == meal_name].copy()

        if meal_df.empty:
            meal_df = diet_db.copy()

        meal_df["calorie_gap"] = (meal_df["Calories"] - target_calories).abs()
        meal_df = meal_df.sort_values(["calorie_gap", "Calories"]).drop_duplicates(subset=["Name"]).head(2)

        meal_plans.append({
            "meal": meal_name,
            "target_calories": round(float(target_calories), 1),
            "recipes": [
                _serialize_recipe(row)
                for _, row in meal_df.iterrows()
            ],
        })

    return {
        "goal": normalized_goal,
        "estimated_daily_calories": estimated_daily_calories,
        "meal_plans": meal_plans,
        "recommendation_count": sum(len(meal_plan["recipes"]) for meal_plan in meal_plans),
    }