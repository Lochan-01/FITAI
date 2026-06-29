from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary():
    from app.routes.history_settings_routes import settings_data, history_entries

    completed_workouts = sum(1 for entry in history_entries if entry.get("status") == "Completed" and entry.get("icon") == "workout")
    logged_meals = sum(1 for entry in history_entries if entry.get("icon") == "meal" or entry.get("status") == "Logged")

    has_data = completed_workouts > 0 or logged_meals > 0
    recovery_score = 0 if not has_data else min(100, 75 + completed_workouts * 3 + max(0, logged_meals - 2))

    calories = 0 if not has_data else 1800 + (completed_workouts * 110) + (logged_meals * 40)
    
    # Dynamically extract BMI value from history entries if present
    bmi = 22.5
    for entry in history_entries:
        if entry.get("icon") == "bmi" or "BMI" in entry.get("title", ""):
            try:
                bmi = float(entry.get("status"))
                break
            except ValueError:
                pass
                
    goal_progress = 0 if not has_data else min(100, 60 + completed_workouts * 4)

    weekly_activity = [0, 0, 0, 0, 0, 0, 0]
    if has_data:
        weekly_activity = [
            min(4.5, round(1.2 + completed_workouts * 0.15, 1)),
            min(4.5, round(1.4 + completed_workouts * 0.12, 1)),
            min(4.5, round(1.3 + completed_workouts * 0.1, 1)),
            min(4.5, round(1.9 + completed_workouts * 0.08, 1)),
            min(4.5, round(2.2 + completed_workouts * 0.07, 1)),
            min(4.5, round(2.6 + completed_workouts * 0.06, 1)),
            min(4.5, round(2.4 + completed_workouts * 0.05, 1)),
        ]

    return {
        "summary": {
            "cards": {
                "calories": {
                    "title": "Calories",
                    "value": int(calories),
                    "subtitle": "Estimated daily burn",
                    "unit": "kcal",
                },
                "bmi": {
                    "title": "BMI",
                    "value": round(bmi, 1),
                    "subtitle": "Based on current profile",
                    "unit": "",
                },
                "workouts": {
                    "title": "Workouts",
                    "value": completed_workouts,
                    "subtitle": "Completed sessions",
                    "unit": "",
                },
                "goal": {
                    "title": "Goal",
                    "value": goal_progress,
                    "subtitle": "Progress toward target",
                    "unit": "%",
                },
            },
            "analytics": {
                "weeklyActivity": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "values": weekly_activity,
                },
                "cards": [
                    {
                        "label": "Weekly Workouts",
                        "value": f"{completed_workouts if has_data else 0}",
                        "note": "Sessions logged this week",
                    },
                    {
                        "label": "Calories Burned",
                        "value": f"{int(calories)} kcal" if has_data else "0 kcal",
                        "note": "Estimated training output",
                    },
                    {
                        "label": "Recovery",
                        "value": f"{recovery_score}%" if has_data else "0%",
                        "note": "Based on recent activity",
                    },
                ],
                "breakdown": [
                    {"name": "Strength", "value": 0 if not has_data else min(100, 70 + completed_workouts * 2), "color": "from-cyan-500 to-blue-500"},
                    {"name": "Cardio", "value": 0 if not has_data else min(100, 60 + logged_meals * 3), "color": "from-emerald-500 to-teal-500"},
                    {"name": "Mobility", "value": 0 if not has_data else min(100, 50 + completed_workouts), "color": "from-pink-500 to-rose-500"},
                ],
            },
            "recommendations": {
                "workout": settings_data.get("fitnessGoal", "Build strength + endurance"),
                "protein": f"{int(settings_data.get('proteinTarget', '150'))} g",
                "water": "3 liters",
                "calories": f"{int(settings_data.get('dailyCalories', '2200'))} kcal",
                "score": 0 if not has_data else max(70, min(98, 82 + completed_workouts)),
            },
            "historyCount": len(history_entries),
        }
    }
