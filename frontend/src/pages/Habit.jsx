import { useState } from "react";
import { FaSpinner, FaRunning, FaBed, FaTint, FaBullseye, FaArrowRight } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

const initialForm = {
  age: 30,
  gender: "Male",
  steps: 4000,
  sleep_hours: 7.0,
  hydration_level: 7.0,
  workout_duration: 30,
  fatigue_score: 3,
  stress_level: 3,
  adherence_rate: 0.75,
  previous_injury: false,
};

function ScoreBar({ label, value, color = "bg-cyan-500" }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl">
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
        <div>{label}</div>
        <div className="text-cyan-400 font-black">{pct}%</div>
      </div>
      <div className="mt-2.5 h-3 w-full rounded-full bg-slate-800 p-0.5 border border-slate-700/40">
        <div className={`h-2 rounded-full ${color} shadow-[0_0_8px_rgba(6,182,212,0.4)]`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Habit() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        age: Number(form.age || 30),
        gender: form.gender || "Male",
        heart_rate: Number(form.heart_rate || 72.0),
        steps: Number(form.steps || 0),
        calories_burned: Number(form.calories_burned || 0.0),
        distance_km: Number(form.distance_km || 0.0),
        activity_type: form.activity_type || "walking",
        sleep_hours: Number(form.sleep_hours || 7.0),
        resting_heart_rate: Number(form.resting_heart_rate || 60.0),
        hydration_level: Number(form.hydration_level || 5.0),
        body_fat: Number(form.body_fat || 20.0),
        bmi: Number(form.bmi || 25.0),
        workout_duration: Number(form.workout_duration || 0),
        workout_intensity: Number(form.workout_intensity || 2),
        fatigue_score: Number(form.fatigue_score || 0),
        stress_level: Number(form.stress_level || 0),
        adherence_rate: Number(form.adherence_rate || 0),
        previous_injury: Boolean(form.previous_injury || false),
        recovery_days: Number(form.recovery_days || 0),
        training_load: Number(form.training_load || 0.0),
        injury_risk: Number(form.injury_risk || 0.01),
        fitness_level: form.fitness_level || "intermediate",
      };

      const resp = await api.post("/habit/predict", payload);
      setResult(resp.data);

      // Save to history log
      try {
        await api.post("/history", {
          title: "Habits Adherence Score",
          time: "Just now",
          status: "Logged",
          details: `Adherence probability: ${Math.round(resp.data.adherence_score * 100)}%. Sleep: ${form.sleep_hours}h, steps: ${form.steps}.`,
          icon: "recovery",
          color: "text-pink-400"
        });
      } catch (historyErr) {
        console.error("Failed to post habits to history log", historyErr);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to get habit prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cyan-500/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Behavior & Habits</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Habit Tracker</h1>
            <p className="mt-2 max-w-xl text-slate-400 text-sm">
              AI-powered adherence prediction and personalized recommendations. Provide your parameters below.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Card className="w-full md:w-64 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <FaBullseye className="text-cyan-400 text-xl" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Last Result Score</div>
                  <div className="text-xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    {result ? `${result.adherence_score}` : "—"}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-800 pt-2">
                Pro tip: enter actual sleep & hydration for optimal scoring.
              </div>
            </Card>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Input form card (col span 7/12) */}
          <Card className="lg:col-span-7 border border-cyan-500/10 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-cyan-500/10 pb-2.5">
              Habit Parameters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Age:</label>
                <input name="age" value={form.age} onChange={handleChange} type="number" placeholder="30" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender:</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Steps today:</label>
                <input name="steps" value={form.steps} onChange={handleChange} type="number" placeholder="4000" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sleep hours:</label>
                <input name="sleep_hours" value={form.sleep_hours} onChange={handleChange} type="number" step="0.1" placeholder="7.5" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hydration (0–10):</label>
                <input name="hydration_level" value={form.hydration_level} onChange={handleChange} type="number" step="0.1" placeholder="7" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Workout duration (min):</label>
                <input name="workout_duration" value={form.workout_duration} onChange={handleChange} type="number" placeholder="30" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Adherence (0–1):</label>
                <input name="adherence_rate" value={form.adherence_rate} onChange={handleChange} type="number" step="0.01" placeholder="0.75" className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Advanced Metrics (Fatigue, Stress, Injury)</div>
                <button type="button" className="text-xs font-black uppercase text-cyan-400 hover:underline cursor-pointer" onClick={() => {
                  const node = document.getElementById('advanced-fields');
                  if (node) node.classList.toggle('hidden');
                }}>Toggle Fields</button>
              </div>

              <div id="advanced-fields" className="hidden mt-4 grid gap-3 sm:grid-cols-3">
                <input name="fatigue_score" value={form.fatigue_score} onChange={handleChange} type="number" placeholder="Fatigue (1-10)" className="rounded-xl border border-cyan-500/20 bg-slate-950/60 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
                <input name="stress_level" value={form.stress_level} onChange={handleChange} type="number" placeholder="Stress (1-10)" className="rounded-xl border border-cyan-500/20 bg-slate-950/60 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" />
                <label className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase select-none"><input name="previous_injury" checked={form.previous_injury} onChange={handleChange} type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-cyan-500/20" /> Previous injury</label>
              </div>
            </div>

            {error ? <div className="text-xs text-rose-400 font-black uppercase pt-2">{error}</div> : null}

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
                {loading ? <FaSpinner className="animate-spin text-sm" /> : null}
                {loading ? "Analyzing..." : "Get Recommendation"}
              </button>
              <button type="button" onClick={() => { setForm(initialForm); setResult(null); }} className="text-xs font-bold uppercase text-slate-400 hover:text-white cursor-pointer px-4 py-3 rounded-xl hover:bg-slate-950/30">Reset</button>
            </div>
          </Card>

          {/* Right / Results card (col span 5/12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-cyan-500/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-cyan-500/10 pb-2.5 mb-4">
                Analysis Output
              </h3>
              
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 bg-slate-950/50 p-4 border border-slate-800 rounded-2xl">
                    <div className="text-center">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Adherence</div>
                      <div className="text-lg font-black text-cyan-400 mt-1">{result.adherence_score}</div>
                    </div>
                    <div className="text-center border-x border-slate-800">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Skip Risk</div>
                      <div className="text-xs font-black text-amber-500 mt-2 uppercase">{result.skip_risk}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Confidence</div>
                      <div className="text-lg font-black text-indigo-400 mt-1">{result.confidence}%</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <ScoreBar label="Wellness Score" value={result.wellness_score / 100} color="bg-cyan-500" />
                    <ScoreBar label="Recovery Index" value={result.recovery_score / 100} color="bg-indigo-500" />
                    <ScoreBar label="Consistency Rate" value={result.consistency_score / 100} color="bg-emerald-500" />
                  </div>

                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 mt-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Coach Motivation</h4>
                    <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed italic">
                      "{result.motivation}"
                    </p>
                  </div>

                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Personalized Tasks</h4>
                    <ul className="mt-2 space-y-2">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-medium leading-relaxed">
                          <FaArrowRight className="text-cyan-400 text-[10px] mt-1 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-semibold text-center py-12">
                  No prediction calculated yet. Provide parameters and submit form to generate outputs.
                </div>
              )}
            </Card>

            <Card className="border border-cyan-500/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-cyan-500/10 pb-2 mb-3">Field Guide</h3>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><strong className="text-cyan-400">Required:</strong> Age, Gender, Steps count, and Sleep hours.</li>
                <li><strong className="text-indigo-400">Recommended:</strong> Daily Hydration and planned Workout durations.</li>
                <li><strong className="text-amber-500">Optional:</strong> Sensation score, stress indicator, injury checkbox.</li>
              </ul>
            </Card>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
