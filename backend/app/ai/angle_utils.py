import math
from typing import Optional, Tuple


def calculate_angle(p1: Tuple[float, float], p2: Tuple[float, float], p3: Tuple[float, float]) -> float:
    """Return the angle in degrees formed by three points."""
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3

    radians = math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2)
    angle = abs(radians * 180.0 / math.pi)
    return 180.0 if angle > 180.0 else angle


def calculate_angle_from_landmarks(landmarks, p1_idx: int, p2_idx: int, p3_idx: int) -> Optional[float]:
    """Calculate an angle using MediaPipe landmark indices."""
    try:
        p1 = landmarks[p1_idx]
        p2 = landmarks[p2_idx]
        p3 = landmarks[p3_idx]
        if p1 is None or p2 is None or p3 is None:
            return None
        return calculate_angle((p1.x, p1.y), (p2.x, p2.y), (p3.x, p3.y))
    except (IndexError, TypeError):
        return None
