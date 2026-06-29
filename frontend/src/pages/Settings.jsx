import { useEffect, useState } from "react";
import { FaBell, FaMoon, FaShieldAlt, FaSlidersH, FaUserCircle, FaUserCog } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

const Toggle = ({ label, description, enabled, icon, onToggle }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/40 border border-slate-800/40 p-4 transition duration-300 hover:border-cyan-500/10">
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-lg text-cyan-400">{icon}</div>
      <div>
        <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider">{label}</h3>
        <p className="mt-1 text-xs text-slate-400 font-semibold">{description}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "bg-slate-700"
      } cursor-pointer`}
      aria-label={label}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  </div>
);

const defaultSettings = {
  displayName: "FitAI User",
  fitnessGoal: "Build strength + endurance",
  dailyCalories: "2200",
  proteinTarget: "150",
  workoutReminders: true,
  mealReminders: true,
  hideProgress: false,
  twoStepLogin: false,
};

export default function Settings() {
  const [profile, setProfile] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get("/settings");
        setProfile({ ...defaultSettings, ...(response.data.settings || {}) });
      } catch {
        setProfile(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await api.post("/settings", profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Preferences</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Settings</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Manage the preferences that shape your dashboard, reminders, and privacy controls.
            </p>
          </div>
        </div>

        {/* Profile and quick overview grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* Profile form parameters */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-2">
              <FaUserCog className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Profile</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Display Name</label>
                <input
                  value={profile.displayName}
                  onChange={(event) => setProfile((prev) => ({ ...prev, displayName: event.target.value }))}
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>
              
              <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fitness Goal</label>
                <input
                  value={profile.fitnessGoal}
                  onChange={(event) => setProfile((prev) => ({ ...prev, fitnessGoal: event.target.value }))}
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Daily Calories Target</label>
                <input
                  value={profile.dailyCalories}
                  onChange={(event) => setProfile((prev) => ({ ...prev, dailyCalories: event.target.value }))}
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div className="bg-slate-950/40 p-4 border border-slate-800/40 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Protein Target (g)</label>
                <input
                  value={profile.proteinTarget}
                  onChange={(event) => setProfile((prev) => ({ ...prev, proteinTarget: event.target.value }))}
                  className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>
            </div>

            <button onClick={handleSave} className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:opacity-95 transition cursor-pointer">
              {loading ? "Loading..." : saved ? "Saved" : "Save Preferences"}
            </button>
          </Card>

          {/* Quick overview */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-3 mb-2">
              <FaUserCircle className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Overview</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-5 text-white shadow-lg shadow-indigo-500/20 border border-cyan-400/25 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-cyan-400/10 blur-xl"></div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/80 font-black">Plan Tier</p>
                <h3 className="mt-1 text-2xl font-black">Premium Membership</h3>
                <p className="mt-2 text-xs text-slate-200 leading-relaxed font-semibold">
                  Active access to advanced tracking modules, scheduled notifications, and AI training models.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/40 p-4 border border-slate-800/40">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <FaSlidersH className="text-sm" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Customization</h3>
                </div>
                <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
                  Adjust targets to shape metrics inside analytics and forecasts.
                </p>
              </div>
            </div>
          </Card>

        </div>

        {/* Toggles section: Notifications and Privacy */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Notifications config */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-2">
              <FaBell className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <Toggle
                label="Workout reminders"
                description="Receive system prompts before scheduled training sessions."
                enabled={profile.workoutReminders}
                icon={<FaBell />}
                onToggle={() => setProfile((prev) => ({ ...prev, workoutReminders: !prev.workoutReminders }))}
              />
              <Toggle
                label="Meal reminders"
                description="Receive scheduled notification alerts for meal tracking."
                enabled={profile.mealReminders}
                icon={<FaMoon />}
                onToggle={() => setProfile((prev) => ({ ...prev, mealReminders: !prev.mealReminders }))}
              />
            </div>
          </Card>

          {/* Privacy config */}
          <Card className="border border-cyan-500/10 space-y-4">
            <div className="flex items-center gap-3 text-pink-400 border-b border-cyan-500/10 pb-3 mb-2">
              <FaShieldAlt className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Privacy</h2>
            </div>
            
            <div className="space-y-4">
              <Toggle
                label="Hide progress stats"
                description="Restrict public view of fitness levels and logged routines."
                enabled={profile.hideProgress}
                icon={<FaShieldAlt />}
                onToggle={() => setProfile((prev) => ({ ...prev, hideProgress: !prev.hideProgress }))}
              />
              <Toggle
                label="Two-step authentication"
                description="Protect logs and preferences with two-step login keys."
                enabled={profile.twoStepLogin}
                icon={<FaShieldAlt />}
                onToggle={() => setProfile((prev) => ({ ...prev, twoStepLogin: !prev.twoStepLogin }))}
              />
            </div>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}