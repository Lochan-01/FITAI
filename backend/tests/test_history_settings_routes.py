from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_history_and_settings_endpoints():
    history_response = client.get("/history")
    assert history_response.status_code == 200
    assert "history" in history_response.json()

    new_entry = {
        "title": "Morning run",
        "status": "Completed",
        "details": "A quick 20-minute jog.",
    }
    post_history_response = client.post("/history", json=new_entry)
    assert post_history_response.status_code == 200
    assert post_history_response.json()["history"][0]["title"] == "Morning run"

    settings_response = client.get("/settings")
    assert settings_response.status_code == 200
    assert "settings" in settings_response.json()

    updated_settings = {
        "displayName": "Coach User",
        "fitnessGoal": "Lose fat",
        "dailyCalories": "1900",
        "proteinTarget": "140",
        "workoutReminders": False,
        "mealReminders": True,
        "hideProgress": True,
        "twoStepLogin": True,
    }
    post_settings_response = client.post("/settings", json=updated_settings)
    assert post_settings_response.status_code == 200
    assert post_settings_response.json()["settings"]["displayName"] == "Coach User"

    dashboard_response = client.get("/dashboard/summary")
    assert dashboard_response.status_code == 200
    assert "summary" in dashboard_response.json()
    assert dashboard_response.json()["summary"]["cards"]["workouts"]["value"] >= 1
