import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { FaChartLine, FaFire, FaHeartbeat, FaRunning, FaDumbbell, FaEllipsisV } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analytics() {
  const zeroSummary = {
    analytics: {
      weeklyActivity: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [0, 0, 0, 0, 0, 0, 0] },
      cards: [
        { label: "Weekly Workouts", value: "0", note: "Sessions logged this week" },
        { label: "Calories Burned", value: "0 kcal", note: "Estimated training output" },
        { label: "Recovery", value: "0%", note: "Based on recent activity" },
      ],
      breakdown: [
        { name: "Strength", value: 0, color: "from-cyan-500 to-blue-500" },
        { name: "Cardio", value: 0, color: "from-emerald-500 to-teal-500" },
        { name: "Mobility", value: 0, color: "from-pink-500 to-rose-500" },
      ],
    },
    historyCount: 0,
  };

  const [summary, setSummary] = useState(zeroSummary);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data.summary);
      } catch (err) {
        console.warn("Failed to load analytics summary:", err);
      }
    };

    loadSummary();
  }, []);

  const analytics = summary.analytics;
  const hasChartData = analytics.weeklyActivity.values.some((value) => value > 0);
  
  const data = {
    labels: analytics.weeklyActivity.labels,
    datasets: [
      {
        label: "Workout Hours",
        data: analytics.weeklyActivity.values,
        backgroundColor: [
          "rgba(6, 182, 212, 0.8)",
          "rgba(99, 102, 241, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(99, 102, 241, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)"
        ],
        borderColor: "#06b6d4",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { display: false } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(71, 85, 105, 0.15)" }, min: 0, max: 5 },
    },
  };

  const cards = analytics.cards.map((card) => ({
    label: card.label,
    value: card.value,
    note: card.note,
    icon: card.label.includes("Calories") ? <FaFire /> : card.label.includes("Recovery") ? <FaHeartbeat /> : <FaDumbbell />,
    color: card.label.includes("Calories") ? "text-amber-400" : card.label.includes("Recovery") ? "text-rose-400" : "text-cyan-400",
  }));

  const breakdown = analytics.breakdown;

  return (
    <DashboardLayout>
      {/* High-tech cyberpunk page styling */}
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header panel */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Performance Analytics</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Analytics</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Track your weekly progress, training balance, and consistency in one polished cyberpunk interface.
            </p>
          </div>
        </div>

        {/* Stats cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.label} className="border border-cyan-500/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{card.label}</p>
                  <h2 className={`mt-3 text-3.5xl font-black ${card.color} drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]`}>
                    {card.value}
                  </h2>
                  <p className="mt-3 text-xs text-slate-400 font-medium">{card.note}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-3xl flex items-center justify-center">
                  <span className={`${card.color}`}>{card.icon}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chart & training balance breakdown */}
        <div className="grid gap-6 xl:grid-cols-3">
          
          <Card className="xl:col-span-2 border border-cyan-500/10">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
              <div>
                <div className="flex items-center gap-3 text-cyan-400">
                  <FaChartLine className="text-xl" />
                  <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Weekly Activity</h2>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 font-medium">Training volume comparison over the last seven days.</p>
              </div>
              <span className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {summary.historyCount} entries logged
              </span>
            </div>

            <div className="h-80">
              {hasChartData ? (
                <Bar data={data} options={options} />
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  No activity logged yet — records appear here after sessions
                </div>
              )}
            </div>
          </Card>

          <Card className="border border-cyan-500/10">
            <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-4 mb-6">
              <FaRunning className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Training Balance</h2>
            </div>

            <div className="space-y-6">
              {breakdown.map((item) => (
                <div key={item.name} className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4">
                  <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>{item.name}</span>
                    <span className="text-cyan-400 font-black">{item.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 p-0.5 border border-slate-700/40">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_8px_rgba(6,182,212,0.4)]`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}