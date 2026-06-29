import { useEffect, useMemo, useState } from "react";
import { FaAppleAlt, FaClock, FaDumbbell, FaRegCheckCircle, FaSpinner, FaWeight } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

const defaultHistory = [
  {
    id: 1,
    title: "Chest + Triceps",
    time: "Today · 6:30 AM",
    status: "Completed",
    details: "4 exercises, 18 total sets, strong final push on incline presses.",
    icon: "workout",
    color: "text-cyan-400",
  },
  {
    id: 2,
    title: "Meal prep review",
    time: "Yesterday · 8:15 PM",
    status: "Logged",
    details: "Protein target hit with balanced carbs and low sugar intake.",
    icon: "meal",
    color: "text-emerald-400",
  },
  {
    id: 3,
    title: "Mobility session",
    time: "Mon · 7:00 AM",
    status: "Completed",
    details: "15 minutes of joint mobility and shoulder stability work.",
    icon: "recovery",
    color: "text-pink-400",
  },
];

const iconMap = {
  workout: <FaDumbbell />,
  meal: <FaAppleAlt />,
  recovery: <FaClock />,
  bmi: <FaWeight />,
};

export default function History() {
  const [sessions, setSessions] = useState(defaultHistory);
  const [form, setForm] = useState({ title: "", details: "", status: "Completed" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get("/history");
        setSessions(response.data.history || defaultHistory);
      } catch {
        setSessions(defaultHistory);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const summary = useMemo(() => {
    const workouts = sessions.filter((item) => item.status === "Completed" && item.icon === "workout").length;
    const meals = sessions.filter((item) => item.icon === "meal" || item.status === "Logged").length;
    const recovery = Math.min(100, 75 + workouts * 3 + Math.max(0, meals - 2));

    return { workouts, meals, recovery };
  }, [sessions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.details.trim()) return;

    const payload = {
      title: form.title.trim(),
      time: "Just now",
      status: form.status,
      details: form.details.trim(),
      icon: form.status === "Logged" ? "meal" : "workout",
      color: form.status === "Logged" ? "text-emerald-400" : "text-cyan-400",
    };

    try {
      const response = await api.post("/history", payload);
      setSessions(response.data.history || []);
      setForm({ title: "", details: "", status: "Completed" });
    } catch {
      const newEntry = {
        id: Date.now(),
        ...payload,
      };
      setSessions((prev) => [newEntry, ...prev]);
      setForm({ title: "", details: "", status: "Completed" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Archive</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">History Log</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Review the sessions you completed recently and keep your momentum visible.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* Recent activity log */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-2">
              <FaRegCheckCircle className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Recent Activity</h2>
            </div>

            {/* Quick entry logger */}
            <form onSubmit={handleSubmit} className="space-y-3 bg-slate-950/40 p-4 border border-slate-800/40 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Log New Session</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                placeholder="Activity title (e.g. Legs HIIT, High protein lunch)"
              />
              <textarea
                value={form.details}
                onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                className="min-h-[80px] w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                placeholder="What happened today? Enter metrics, reps, notes..."
              />
              <div className="flex items-center justify-between gap-3 pt-1">
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="rounded-xl border border-cyan-500/20 bg-slate-950/60 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="Logged">Logged</option>
                  <option value="Planned">Planned</option>
                </select>
                
                <button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:opacity-95 transition cursor-pointer">
                  Add entry
                </button>
              </div>
            </form>

            {/* List entries */}
            <div className="space-y-6 pt-4 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-800">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest py-4 pl-6 animate-pulse">
                  <FaSpinner className="animate-spin text-cyan-400" />
                  Loading history log...
                </div>
              ) : sessions.map((session, index) => (
                <div key={session.id} className="relative pl-8">
                  {/* Glowing timeline circle tag */}
                  <span className={`absolute left-0 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border bg-slate-950 text-[10px] font-black ${
                    session.icon === "workout" 
                      ? "border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
                      : session.icon === "meal" 
                      ? "border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                      : session.icon === "bmi"
                      ? "border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                      : "border-pink-500 text-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                  }`}>
                    {index + 1}
                  </span>

                  <div className="rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-cyan-500/20 transition-all duration-300 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`rounded-xl bg-slate-900 border border-slate-800 p-3 text-lg ${session.color}`}>
                          {iconMap[session.icon] || <FaDumbbell />}
                        </div>
                        <div>
                          <h3 className="text-md font-extrabold text-slate-200">{session.title}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{session.time}</p>
                          <p className="mt-2.5 text-xs text-slate-400 font-medium leading-relaxed max-w-xl">{session.details}</p>
                        </div>
                      </div>
                      <span className={`rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-wider md:self-start ${
                        session.status === "Completed" 
                          ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-300" 
                          : session.status === "Logged" 
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300" 
                          : "border-slate-800 bg-slate-900 text-slate-400"
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Right panel: summary details */}
          <Card className="border border-cyan-500/10">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Momentum stats</p>
            <h2 className="mt-2 text-lg font-bold uppercase tracking-wider text-slate-200 border-b border-cyan-500/10 pb-3">7-Day Summary</h2>
            
            <div className="mt-4 space-y-4">
              <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workouts Completed</p>
                <p className="mt-2 text-3xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  {summary.workouts}
                </p>
              </div>
              
              <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Meals Logged</p>
                <p className="mt-2 text-3xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  {summary.meals}
                </p>
              </div>
              
              <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Calculated Recovery Score</p>
                <p className="mt-2 text-3xl font-black text-pink-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  {summary.recovery}%
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}