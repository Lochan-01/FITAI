from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np

from app.ai.angle_utils import calculate_angle_from_landmarks


@dataclass
class ExerciseState:
    exercise: str
    reps: int = 0
    stage: str = "Up"
    feedback: str = "Start the movement with good posture"
    angles: Dict[str, float] = field(default_factory=dict)
    duration_seconds: float = 0.0
    accuracy_score: float = 100.0
    calories_estimate: float = 0.0
    last_update: float = 0.0


class ExerciseDetector:
    """Exercise detector built on top of MediaPipe landmarks."""

    def __init__(self, exercise: str = "Squat") -> None:
        self.exercise = exercise
        self.state = ExerciseState(exercise=exercise)
        self._phase = "Up"
        self._last_stage = "Up"
        self._rep_count = 0

    def analyze(self, landmarks, fps: float) -> Dict[str, object]:
        if landmarks is None:
            return self._build_result()

        angles = {}
        if self.exercise == "Squat":
            left_hip = calculate_angle_from_landmarks(landmarks, 23, 25, 27)
            right_hip = calculate_angle_from_landmarks(landmarks, 24, 26, 28)
            angles["left_knee"] = left_hip or 0.0
            angles["right_knee"] = right_hip or 0.0
            self._update_rep_counter(angles.get("left_knee", 0.0), threshold=100.0)
            feedback = self._squat_feedback(angles.get("left_knee", 0.0))
        elif self.exercise == "Push-up":
            left_elbow = calculate_angle_from_landmarks(landmarks, 11, 13, 15)
            right_elbow = calculate_angle_from_landmarks(landmarks, 12, 14, 16)
            angles["left_elbow"] = left_elbow or 0.0
            angles["right_elbow"] = right_elbow or 0.0
            self._update_rep_counter(angles.get("left_elbow", 0.0), threshold=90.0)
            feedback = self._pushup_feedback(angles.get("left_elbow", 0.0))
        elif self.exercise == "Bicep Curl":
            left_elbow = calculate_angle_from_landmarks(landmarks, 11, 13, 15)
            right_elbow = calculate_angle_from_landmarks(landmarks, 12, 14, 16)
            angles["left_elbow"] = left_elbow or 0.0
            angles["right_elbow"] = right_elbow or 0.0
            self._update_rep_counter(angles.get("left_elbow", 0.0), threshold=120.0)
            feedback = self._curl_feedback(angles.get("left_elbow", 0.0))
        elif self.exercise == "Shoulder Press":
            left_shoulder = calculate_angle_from_landmarks(landmarks, 11, 13, 15)
            right_shoulder = calculate_angle_from_landmarks(landmarks, 12, 14, 16)
            angles["left_shoulder"] = left_shoulder or 0.0
            angles["right_shoulder"] = right_shoulder or 0.0
            self._update_rep_counter(angles.get("left_shoulder", 0.0), threshold=150.0)
            feedback = self._shoulder_press_feedback(angles.get("left_shoulder", 0.0))
        elif self.exercise == "Jumping Jacks":
            left_arm = calculate_angle_from_landmarks(landmarks, 11, 13, 15)
            right_arm = calculate_angle_from_landmarks(landmarks, 12, 14, 16)
            angles["left_arm"] = left_arm or 0.0
            angles["right_arm"] = right_arm or 0.0
            self._update_rep_counter((angles.get("left_arm", 0.0) + angles.get("right_arm", 0.0)) / 2.0, threshold=120.0)
            feedback = self._jumping_jack_feedback(angles.get("left_arm", 0.0))
        elif self.exercise == "Plank Hold":
            left_shoulder = calculate_angle_from_landmarks(landmarks, 11, 13, 15)
            right_shoulder = calculate_angle_from_landmarks(landmarks, 12, 14, 16)
            angles["left_shoulder"] = left_shoulder or 0.0
            angles["right_shoulder"] = right_shoulder or 0.0
            feedback = self._plank_feedback(angles.get("left_shoulder", 0.0))
        else:
            feedback = "Exercise not supported yet"

        self.state.angles = {k: round(float(v), 1) for k, v in angles.items()}
        self.state.feedback = feedback
        self.state.reps = self._rep_count
        self.state.stage = self._phase
        self.state.duration_seconds += 1.0 / max(fps, 1.0)
        self.state.accuracy_score = self._estimate_accuracy(angles)
        self.state.calories_estimate = round(self._estimate_calories(), 2)
        self.state.last_update = fps

        return self._build_result()

    def _update_rep_counter(self, angle: float, threshold: float) -> None:
        if self._phase == "Up" and angle < threshold:
            self._phase = "Down"
        elif self._phase == "Down" and angle > threshold:
            self._phase = "Up"
            self._rep_count += 1

    def _estimate_accuracy(self, angles: Dict[str, float]) -> float:
        if not angles:
            return 100.0
        values = list(angles.values())
        if not values:
            return 100.0
        average_angle = float(np.mean(values))
        return round(max(70.0, min(100.0, 100.0 - abs(average_angle - 120.0) * 0.2)), 1)

    def _estimate_calories(self) -> float:
        base = {"Squat": 0.08, "Push-up": 0.12, "Bicep Curl": 0.07, "Shoulder Press": 0.09, "Jumping Jacks": 0.1, "Plank Hold": 0.05}
        return self.state.reps * base.get(self.exercise, 0.05) + (self.state.duration_seconds / 60.0) * 2.0

    def _squat_feedback(self, knee_angle: float) -> str:
        if knee_angle < 90:
            return "Squat deeper"
        if knee_angle > 140:
            return "Lower your hips"
        return "Good squat depth"

    def _pushup_feedback(self, elbow_angle: float) -> str:
        if elbow_angle < 80:
            return "Extend your arms fully"
        if elbow_angle > 140:
            return "Lower your chest"
        return "Good push-up form"

    def _curl_feedback(self, elbow_angle: float) -> str:
        if elbow_angle < 80:
            return "Curl the weight up"
        if elbow_angle > 160:
            return "Lower the weight slowly"
        return "Good curl form"

    def _shoulder_press_feedback(self, shoulder_angle: float) -> str:
        if shoulder_angle < 130:
            return "Press overhead fully"
        return "Good shoulder press form"

    def _jumping_jack_feedback(self, arm_angle: float) -> str:
        if arm_angle > 160:
            return "Open your arms wider"
        return "Good jumping jack rhythm"

    def _plank_feedback(self, shoulder_angle: float) -> str:
        if shoulder_angle > 160:
            return "Keep your back straight"
        return "Hold the plank position"

    def _build_result(self) -> Dict[str, object]:
        return {
            "exercise": self.exercise,
            "total_reps": self.state.reps,
            "duration": round(self.state.duration_seconds, 2),
            "calories_burned": self.state.calories_estimate,
            "accuracy_score": self.state.accuracy_score,
            "stage": self.state.stage,
            "feedback": self.state.feedback,
            "angles": self.state.angles,
        }
