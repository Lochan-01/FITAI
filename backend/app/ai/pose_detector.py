from __future__ import annotations

import base64
import os
import cv2
import numpy as np
from typing import Dict, Tuple

vision = None
BaseOptions = None
PoseLandmarker = None
PoseLandmarkerOptions = None
RunningMode = None

try:
    import importlib

    mp_vision = importlib.import_module("mediapipe.tasks.python.vision")
    mp_core_base_options = importlib.import_module("mediapipe.tasks.python.core.base_options")

    vision = mp_vision
    BaseOptions = mp_core_base_options.BaseOptions
    PoseLandmarker = mp_vision.PoseLandmarker
    PoseLandmarkerOptions = mp_vision.PoseLandmarkerOptions
    RunningMode = mp_vision.RunningMode
except Exception:  # pragma: no cover - runtime environment may be missing MediaPipe support
    vision = None
    BaseOptions = None
    PoseLandmarker = None
    PoseLandmarkerOptions = None
    RunningMode = None

from app.ai.exercise_detector import ExerciseDetector


class PoseDetector:
    """Realtime pose detector using MediaPipe Pose and OpenCV."""

    def __init__(self, exercise: str = "Squat") -> None:
        self.exercise = exercise
        self.detector = ExerciseDetector(exercise=exercise)
        self.landmarker = None
        self.mp_drawing = None
        self.cap = None
        self.initialization_error = None

        if vision is not None and PoseLandmarker is not None and PoseLandmarkerOptions is not None and RunningMode is not None:
            try:
                # attempt to load model from bundled models folder
                model_path = os.path.join(os.path.dirname(__file__), "models", "pose_landmarker.task")
                if not os.path.exists(model_path):
                    self.initialization_error = f"Pose model not found at {model_path}. Install or place the MediaPipe .task model in backend/app/ai/models/."
                    return
                options = PoseLandmarkerOptions(
                    base_options=BaseOptions(model_asset_path=model_path),
                    running_mode=RunningMode.VIDEO,
                    num_poses=1,
                )
                self.landmarker = PoseLandmarker.create_from_options(options)
                self.mp_drawing = vision.drawing_utils
            except Exception as exc:  # pragma: no cover - environment compatibility issue
                self.initialization_error = f"MediaPipe Pose initialization failed: {exc}"

    def reload_model(self) -> None:
        """Attempt to (re)load the MediaPipe pose_landmarker.task model at runtime.

        Useful when model file is added after the server started.
        """
        # reset any previous state
        self.landmarker = None
        self.mp_drawing = None
        self.initialization_error = None

        if vision is None or PoseLandmarker is None or PoseLandmarkerOptions is None or RunningMode is None:
            self.initialization_error = "MediaPipe Tasks not available in this Python environment."
            return

        try:
            model_path = os.path.join(os.path.dirname(__file__), "models", "pose_landmarker.task")
            if not os.path.exists(model_path):
                self.initialization_error = f"Pose model not found at {model_path}."
                return
            options = PoseLandmarkerOptions(
                base_options=BaseOptions(model_asset_path=model_path),
                running_mode=RunningMode.VIDEO,
                num_poses=1,
            )
            self.landmarker = PoseLandmarker.create_from_options(options)
            self.mp_drawing = vision.drawing_utils
            self.initialization_error = None
        except Exception as exc:
            self.initialization_error = f"MediaPipe Pose initialization failed: {exc}"

    def start_camera(self, camera_index: int = 0):
        # reuse existing capture if possible
        if self.cap is not None and self.cap.isOpened():
            return self.cap

        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            # ensure cap is released on failure
            try:
                self.cap.release()
            except Exception:
                pass
            self.cap = None
            raise RuntimeError("Unable to access webcam")
        return self.cap

    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict[str, object]]:
        if self.landmarker is None or self.mp_drawing is None:
            cv2.putText(frame, "Camera unavailable", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 80, 80), 2)
            cv2.putText(frame, self.initialization_error or "MediaPipe Pose is not available in this environment", (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
            return frame, {
                "exercise": self.exercise,
                "total_reps": 0,
                "duration": 0.0,
                "calories_burned": 0.0,
                "accuracy_score": 0.0,
                "stage": "Up",
                "feedback": "Camera unavailable. Install a compatible MediaPipe build or use a supported Python environment.",
                "angles": {},
            }

        try:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # use millisecond timestamps for MediaPipe video API
            import time as _time

            timestamp_ms = int(_time.time() * 1000)
            results = self.landmarker.detect_for_video(rgb, timestamp_ms)

            # Normalize landmarks extraction for different return shapes from MediaPipe Tasks
            raw_pose = getattr(results, "pose_landmarks", None)
            landmarks = None
            draw_target = raw_pose

            if raw_pose is None:
                landmarks = None
            else:
                # If raw_pose has a .landmark attribute (NormalizedLandmarkList), use it
                if hasattr(raw_pose, "landmark"):
                    landmarks = raw_pose.landmark
                    draw_target = raw_pose
                elif isinstance(raw_pose, (list, tuple)) and len(raw_pose) > 0:
                    first = raw_pose[0]
                    if hasattr(first, "landmark"):
                        landmarks = first.landmark
                        draw_target = first
                    else:
                        # assume raw_pose itself is the list of landmarks
                        landmarks = raw_pose
                        draw_target = raw_pose
                else:
                    landmarks = None
                    draw_target = raw_pose

        except Exception as exc:  # guard against MediaPipe runtime errors
            cv2.putText(frame, f"Detection error: {str(exc)[:80]}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 80, 80), 2)
            landmarks = None
            draw_target = None

        if draw_target is not None:
            try:
                self.mp_drawing.draw_landmarks(
                    frame,
                    draw_target,
                    vision.PoseLandmarksConnections.POSE_LANDMARKS,
                    landmark_drawing_spec=self.mp_drawing.DrawingSpec(color=(34, 211, 238), thickness=2, circle_radius=2),
                    connection_drawing_spec=self.mp_drawing.DrawingSpec(color=(52, 211, 153), thickness=2),
                )
            except Exception:
                # ignore drawing failures
                pass

        # overlay debug: show number of landmarks passed to analyzer
        try:
            lm_count = len(landmarks) if landmarks is not None else 0
        except Exception:
            lm_count = 0
        cv2.putText(frame, f"LM: {lm_count}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)

        stats = self.detector.analyze(landmarks, fps=20.0)
        cv2.putText(frame, f"Exercise: {stats['exercise']}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (34, 211, 238), 2)
        cv2.putText(frame, f"Reps: {stats['total_reps']}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (52, 211, 153), 2)
        cv2.putText(frame, f"Stage: {stats['stage']}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"Feedback: {stats['feedback']}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        cv2.putText(frame, f"Accuracy: {stats['accuracy_score']}%", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

        return frame, stats

    def frame_to_base64(self, frame: np.ndarray) -> str:
        _, encoded = cv2.imencode(".jpg", frame)
        return base64.b64encode(encoded).decode("ascii")

    def release(self) -> None:
        if self.cap is not None:
            self.cap.release()
            self.cap = None
