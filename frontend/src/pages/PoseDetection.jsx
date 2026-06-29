import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { FaCamera, FaCheckCircle, FaVideo, FaSpinner, FaArrowRight } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";

const EXERCISES = ["Squat", "Push-up", "Bicep Curl", "Shoulder Press", "Jumping Jacks", "Plank Hold"];

export default function PoseDetection() {
  const imageRef = useRef(null);
  const [exercise, setExercise] = useState("Squat");
  const [stats, setStats] = useState({
    exercise: "Squat",
    total_reps: 0,
    duration: 0,
    calories_burned: 0,
    accuracy_score: 100,
    stage: "Up",
    feedback: "Start with a controlled movement and keep your posture upright.",
    angles: {},
  });
  const [streamError, setStreamError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    if (!isCameraOpen) {
      imageElement.src = "";
      setStreamError("");
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    setStreamError("");
    imageElement.src = `http://127.0.0.1:8000/pose/stream?ts=${Date.now()}`;

    const intervalId = window.setInterval(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/pose/stats");
        const data = await response.json();
        setStats((prev) => ({ ...prev, ...data }));
        setStreamError("");
      } catch (error) {
        setStreamError("Unable to reach the pose backend stream yet.");
      }
    }, 500);

    return () => {
      window.clearInterval(intervalId);
      imageElement.src = "";
    };
  }, [isCameraOpen]);

  const toggleExercise = () => {
    setExercise((prev) => (prev === "Squat" ? "Push-up" : "Squat"));
    setStats((prev) => ({ ...prev, exercise, total_reps: 0, stage: "Up", feedback: "Exercise switched. Start your next set." }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Movement Analysis</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Pose Detection</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Use your webcam with MediaPipe Pose landmarks to analyze squats and push-ups in real time.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* Left panel: Camera feed container */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
              <div className="flex items-center gap-3 text-cyan-400">
                <FaVideo className="text-xl" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Camera Feed</h2>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                isConnecting 
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400 animate-pulse" 
                  : isCameraOpen 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                  : "border-slate-800 bg-slate-900/60 text-slate-400"
              }`}>
                {isConnecting ? "Connecting..." : isCameraOpen ? "Camera Live" : "Camera Off"}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsCameraOpen((prev) => !prev)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition duration-300 cursor-pointer"
              >
                {isCameraOpen ? "Stop Camera" : "Open Camera"}
              </button>
            </div>

            {/* Video preview viewport */}
            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-center relative min-h-[300px]">
              {isCameraOpen ? (
                <img
                  ref={imageRef}
                  alt="Pose detection stream"
                  className="w-full h-auto object-cover rounded-2xl"
                  onLoad={() => setIsConnecting(false)}
                  onError={() => {
                    setIsConnecting(false);
                    setStreamError("Camera error: Verify backend is active and camera is accessible.");
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <img src={logo} alt="FitAI" className="h-28 w-auto opacity-40 object-contain select-none" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 mt-4">Hardware stream disconnected</span>
                </div>
              )}
            </div>

            {!isCameraOpen ? (
              <p className="text-xs text-slate-400 font-semibold italic">Click “Open Camera” to start the live video processing feed.</p>
            ) : null}
          </Card>

          {/* Right panel: Controls and feedback metrics */}
          <div className="space-y-6">
            
            {/* Exercise selection */}
            <Card className="border border-cyan-500/10 space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3">
                <FaCamera className="text-xl" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Exercise Mode</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {EXERCISES.map((item) => (
                  <button
                    key={item}
                    onClick={() => setExercise(item)}
                    className={`rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wider transition border ${
                      exercise === item 
                        ? "bg-gradient-to-r from-indigo-600 to-cyan-500 border-cyan-400 text-white shadow-md" 
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    } cursor-pointer`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <button onClick={toggleExercise} className="w-full mt-2 py-3 rounded-xl border border-cyan-500/20 bg-slate-950/40 text-xs font-black uppercase tracking-wider text-cyan-400 hover:bg-slate-950/80 cursor-pointer">
                Switch Target: {exercise === "Squat" ? "Push-up" : "Squat"}
              </button>
            </Card>

            {/* Feedback and dynamic metrics */}
            <Card className="border border-cyan-500/10 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 border-b border-cyan-500/10 pb-3">
                <FaCheckCircle className="text-xl" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Live Feedback</h2>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Activity</span>
                  <span className="text-cyan-400 font-black uppercase">{stats.exercise}</span>
                </div>
                
                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Reps Counted</span>
                  <span className="text-white font-black">{stats.total_reps}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Position Stage</span>
                  <span className="text-amber-500 font-black uppercase">{stats.stage}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Duration</span>
                  <span className="text-white font-black">{stats.duration.toFixed(1)}s</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Calories Burned</span>
                  <span className="text-white font-black">{stats.calories_burned.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Accuracy Match</span>
                  <span className="text-emerald-400 font-black">{stats.accuracy_score}%</span>
                </div>

                {/* Angles and Landmarks */}
                <div className="bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Webcam Landmark Angles</span>
                  <span className="text-slate-300 font-medium font-mono text-[10px] break-all leading-relaxed">
                    {Object.entries(stats.angles).map(([key, value]) => `${key}: ${value}`).join(" • ") || "Awaiting landmark vectors..."}
                  </span>
                </div>

                {/* Text coach response */}
                <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Coach Cue</h4>
                  <p className="mt-1.5 text-xs text-slate-400 font-semibold italic leading-relaxed">
                    "{stats.feedback}"
                  </p>
                </div>

                {streamError ? (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-rose-300 text-xs font-bold uppercase tracking-wide">
                    {streamError}
                  </div>
                ) : null}
              </div>
            </Card>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}