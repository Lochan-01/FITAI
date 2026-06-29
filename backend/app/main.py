from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.routes.auth_routes import router as auth_router
from app.routes.diet_routes import router as diet_router
from app.routes import workout_routes
from app.routes.habit_routes import router as habit_router
from app.routes.chatbot_routes import router as chatbot_router
from app.routes.history_settings_routes import router as history_settings_router
from app.routes.dashboard_routes import router as dashboard_router
from app.ai.pose_detector import PoseDetector
import cv2
import numpy as np
import time

app = FastAPI(
    title="FitAI API",
    version="1.0.0"
)

pose_detector = PoseDetector(exercise="Squat")
app.include_router(auth_router)
app.include_router(diet_router)
app.include_router(workout_routes.router)
app.include_router(habit_router)
app.include_router(chatbot_router)
app.include_router(history_settings_router)
app.include_router(dashboard_router)
# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "🚀 FitAI Backend is Running!",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@app.get("/pose/stream")
async def pose_stream():
    def generate_frames():
        try:
            cap = pose_detector.start_camera(0)
        except Exception as exc:
            # return a single JPEG with error message
            img = 255 * np.ones((240, 320, 3), dtype=np.uint8)
            cv2.putText(img, f"Camera error: {str(exc)[:80]}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
            _, jpg = cv2.imencode(".jpg", img)
            yield (b"--frame\r\n" + b"Content-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
            return

        try:
            retry_count = 0
            while True:
                try:
                    success, frame = cap.read()
                    if not success or frame is None:
                        # try a few times to recover
                        retry_count += 1
                        if retry_count > 5:
                            break
                        time.sleep(0.05)
                        continue
                    retry_count = 0

                    processed, stats = pose_detector.process_frame(frame)
                    _, jpg = cv2.imencode(".jpg", processed)
                    frame_bytes = jpg.tobytes()
                    yield (b"--frame\r\n"
                           b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
                except Exception:
                    # on per-frame processing error, yield an error frame but keep the stream alive
                    err_img = 255 * np.ones((240, 320, 3), dtype=np.uint8)
                    cv2.putText(err_img, "Processing error", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                    _, jpg = cv2.imencode(".jpg", err_img)
                    yield (b"--frame\r\n" + b"Content-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
                    time.sleep(0.05)
        finally:
            try:
                cap.release()
            except Exception:
                pass

    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")


@app.get("/pose/stats")
async def pose_stats():
    if pose_detector.initialization_error:
        return {"error": pose_detector.initialization_error}
    return pose_detector.detector._build_result()


@app.post("/pose/reload")
async def pose_reload():
    """Attempt to reload the MediaPipe model at runtime. Returns initialization status."""
    pose_detector.reload_model()
    if pose_detector.initialization_error:
        return {"status": "error", "detail": pose_detector.initialization_error}
    return {"status": "ok", "detail": "Model loaded"}