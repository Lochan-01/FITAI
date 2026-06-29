import { useState } from "react";
import { FaDumbbell, FaRunning, FaStopwatch, FaSpinner, FaCogs, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

export default function Workout() {
  const [form, setForm] = useState({
    age: "",
    gender: "male",
    height_cm: "",
    weight_kg: "",
    body_fat: "",
    grip_force: "",
    sit_bend: "",
    situps: "",
    broad_jump: "",
    goal: "strength",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitWorkout = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        age: Number(form.age),
        gender: form.gender,
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        body_fat: Number(form.body_fat),
        grip_force: Number(form.grip_force),
        sit_bend: Number(form.sit_bend),
        situps: Number(form.situps),
        broad_jump: Number(form.broad_jump),
        goal: form.goal,
      };

      const response = await api.post("/workout/recommend", payload);
      setResult(response.data);

      // Save to history log
      try {
        await api.post("/history", {
          title: `Workout Plan: ${form.goal.replace("_", " ")}`,
          time: "Just now",
          status: "Completed",
          details: `Generated custom exercises based on fitness level prediction class: ${response.data.class_label || "Active"}.`,
          icon: "workout",
          color: "text-cyan-400"
        });
      } catch (historyErr) {
        console.error("Failed to post workout to history log", historyErr);
      }
    } catch (requestError) {
      setResult(null);
      setError(requestError.response?.data?.detail || requestError.message || "Unable to generate workout plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Workout Model</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Workout Planner</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Enter your body metrics and training goal. The trained backend model will predict your fitness level and return recommended exercises.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* Left panel: Form parameters */}
          <Card className="border border-cyan-500/10 space-y-5">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3">
              <FaDumbbell className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Workout Inputs</h2>
            </div>

            <form onSubmit={submitWorkout} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Height (cm)</label>
                <input type="number" step="0.1" name="height_cm" value={form.height_cm} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Weight (kg)</label>
                <input type="number" step="0.1" name="weight_kg" value={form.weight_kg} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Body Fat %</label>
                <input type="number" step="0.1" name="body_fat" value={form.body_fat} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Grip Force</label>
                <input type="number" step="0.1" name="grip_force" value={form.grip_force} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sit and Bend Forward (cm)</label>
                <input type="number" step="0.1" name="sit_bend" value={form.sit_bend} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sit-ups Count</label>
                <input type="number" name="situps" value={form.situps} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Broad Jump (cm)</label>
                <input type="number" step="0.1" name="broad_jump" value={form.broad_jump} onChange={handleChange} required className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange} className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none">
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaDumbbell className="text-sm" />}
                  {loading ? "Generating Plan..." : "Generate Workout Plan"}
                </button>
              </div>
            </form>
          </Card>

          {/* Right panel: Results */}
          <div className="space-y-6">
            <Card className="border border-cyan-500/10">
              <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-3 mb-4">
                <FaRunning className="text-xl" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Model Output</h2>
              </div>

              {error ? (
                <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-xs font-bold uppercase">
                  {error}
                </p>
              ) : result ? (
                <div className="space-y-4">
                  {/* Fitness Level prediction header */}
                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Predicted Fitness Level</p>
                    <p className="mt-1 text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                      {result.fitness_level}
                    </p>
                  </div>

                  {/* Workout exercises list */}
                  <div className="space-y-3">
                    {result.workouts?.length ? (
                      result.workouts.map((workout, index) => (
                        <div key={`${workout.exercise_name}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4 hover:border-cyan-500/20 transition duration-300">
                          <h3 className="text-sm font-extrabold text-cyan-300">{workout.exercise_name}</h3>
                          
                          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-400 font-bold uppercase bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/40">
                            <span>Sets: <strong className="text-white">{workout.sets}</strong></span>
                            <span>Reps: <strong className="text-white">{workout.reps}</strong></span>
                            <span>Intensity: <strong className="text-white">{workout.intensity}</strong></span>
                            <span>Equipment: <strong className="text-white">{workout.equipment}</strong></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-400 font-semibold text-center">
                        No workout suggestions were returned for the selected goal.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Initial instructions */
                <div className="space-y-4 text-xs text-slate-400 font-semibold leading-relaxed">
                  <p>Provide your metrics on the left form to request plan generations from the neural models.</p>
                  
                  <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-slate-300 font-black uppercase tracking-wider">
                      <FaStopwatch className="text-cyan-400 text-sm" />
                      <span>Output Deliverables</span>
                    </div>
                    <ul className="space-y-2 text-slate-400 font-medium pl-1.5">
                      <li className="flex items-center gap-2"><FaArrowRight className="text-cyan-400 text-[8px]" /> Neural fitness tier prediction</li>
                      <li className="flex items-center gap-2"><FaArrowRight className="text-cyan-400 text-[8px]" /> Customized target exercise library</li>
                      <li className="flex items-center gap-2"><FaArrowRight className="text-cyan-400 text-[8px]" /> Sets, reps, weights and tool parameters</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}