import os
import json
from urllib import request, error
from app.config import GEMINI_API_KEY

DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


def _fallback_reply(message: str) -> str:
    lowered = message.lower()

    if any(word in lowered for word in ["workout", "train", "exercise", "routine"]):
        return (
            "A simple starter plan is: 3 full-body sessions per week, 6-10 reps for strength exercises, "
            "and 20-30 minutes of cardio after. Keep 1-2 reps in reserve and progress slowly."
        )

    if any(word in lowered for word in ["diet", "meal", "protein", "calories", "cut", "bulk"]):
        return (
            "A practical starting point is to eat 3 balanced meals with a protein source at each one, "
            "add vegetables and whole grains, and keep your calorie intake consistent for 2-3 weeks before changing it."
        )

    if any(word in lowered for word in ["sleep", "recovery", "rest", "fatigue", "muscle"]):
        return (
            "Recovery matters as much as training. Aim for 7-9 hours of sleep, hydrate well, and consider a lighter day "
            "if your body feels unusually sore or drained."
        )

    return (
        "I can still help with a general fitness suggestion: stay consistent with your training, prioritize protein and hydration, "
        "and make small weekly changes instead of big drastic ones."
    )


def get_gemini_reply(message: str) -> str:
    """Send a fitness or wellness question to Gemini and return the response."""
    if not GEMINI_API_KEY:
        return "The AI coach is not configured yet. Please add a Gemini API key."

    system_prompt = (
        "You are FitAI, a friendly and practical fitness, nutrition, and wellness coach. "
        "Answer clearly, briefly, and helpfully. If a question is health-related, provide safe general advice "
        "and encourage professional guidance for medical concerns."
    )

    prompt = f"{system_prompt}\n\nUser: {message}\n\nCoach response:"

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 500,
        },
    }

    models_to_try = [DEFAULT_MODEL, "gemini-1.5-flash", "gemini-1.5-flash-latest"]

    for model_name in models_to_try:
        try:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
                f"?key={GEMINI_API_KEY}"
            )
            req = request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        except (error.HTTPError, error.URLError, KeyError, TimeoutError, ValueError):
            continue
        except Exception:
            continue

    return _fallback_reply(message)
