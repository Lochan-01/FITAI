import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
} from "chart.js";
import { FaCalculator, FaChartLine, FaWeight } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler);

const initialEntries = [
  { week: "Week 1", weight: 74, height: 178 },
  { week: "Week 2", weight: 73.5, height: 178 },
  { week: "Week 3", weight: 73.2, height: 178 },
  { week: "Week 4", weight: 72.8, height: 178 },
];

function calculateBMI(weight, heightCm) {
  if (!heightCm || !weight) return 0;
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
}

function getBMIStatus(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function BMI() {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState({ week: "Week 5", weight: "72.5", height: "178" });

  const latestEntry = entries[entries.length - 1];
  const currentBMI = calculateBMI(latestEntry.weight, latestEntry.height);
  const latestTrend = entries.length > 1 ? currentBMI - calculateBMI(entries[entries.length - 2].weight, entries[entries.length - 2].height) : 0;

  const chartData = useMemo(() => ({
    labels: entries.map((entry) => entry.week),
    datasets: [
      {
        label: "BMI",
        data: entries.map((entry) => calculateBMI(entry.weight, entry.height)),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.08)",
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#f8fafc",
        fill: true,
        tension: 0.35,
      },
    ],
  }), [entries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(71, 85, 105, 0.15)" },
        ticks: { color: "#94a3b8" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const weight = Number(form.weight);
    const height = Number(form.height);

    if (!weight || !height) return;

    const bmiValue = calculateBMI(weight, height);
    const statusLabel = getBMIStatus(bmiValue);

    setEntries((prev) => [
      ...prev,
      {
        week: form.week || `Week ${prev.length + 1}`,
        weight,
        height,
      },
    ]);
    setForm((prev) => ({ ...prev, week: `Week ${entries.length + 2}` }));

    // Send update to history logs
    try {
      await api.post("/history", {
        title: "BMI Tracker Update",
        time: "Just now",
        status: String(bmiValue), // Store the numeric BMI so backend summary parses it!
        details: `Logged weight: ${weight}kg, height: ${height}cm. BMI status: ${statusLabel}.`,
        icon: "bmi",
        color: "text-cyan-400"
      });
    } catch (historyErr) {
      console.error("Failed to log BMI update to history logs", historyErr);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Body Metrics</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">BMI Tracker</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Track your weekly weight changes, calculate your BMI instantly, and view your past progress in a smooth line chart.
            </p>
          </div>
        </div>

        {/* Top Cards (BMI status, Form calculator, Trend summary) */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Current BMI */}
          <Card className="border border-cyan-500/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Current BMI</p>
                <h2 className="mt-3 text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {currentBMI}
                </h2>
                <p className="mt-2 text-sm text-emerald-400 font-bold uppercase tracking-wider">{getBMIStatus(currentBMI)}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 text-3xl flex items-center justify-center">
                <FaWeight className="text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* BMI Calculator Form */}
          <Card className="border border-cyan-500/10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">BMI Calculator</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="week"
                value={form.week}
                onChange={handleChange}
                placeholder="Week label"
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
              <input
                type="number"
                step="0.1"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="Weight (kg)"
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
              <input
                type="number"
                step="0.1"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="Height (cm)"
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
              <button type="submit" className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition duration-300 cursor-pointer">
                Save weekly entry
              </button>
            </form>
          </Card>

          {/* Trend Summary */}
          <Card className="border border-cyan-500/10 flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Trend Summary</p>
            <div className="flex items-center gap-4 text-emerald-400 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
              <FaChartLine className="text-4xl text-cyan-400" />
              <div>
                <h3 className="text-lg font-black text-white">{latestTrend < 0 ? "Improving trend" : latestTrend > 0 ? "Watch your trend" : "Steady progress"}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {latestTrend < 0 ? `${Math.abs(latestTrend).toFixed(1)} BMI points down` : latestTrend > 0 ? `${latestTrend.toFixed(1)} BMI points up` : "No change this week"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="border border-cyan-500/10">
          <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-4 mb-5">
            <FaCalculator className="text-xl" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Weekly BMI Chart</h2>
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Recommended range info */}
        <Card className="border border-cyan-500/10">
          <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-4 mb-4">
            <FaChartLine className="text-xl" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Recommended range</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            A healthy BMI range is usually between 18.5 and 24.9. Keep your routine consistent, and update your weekly weight to stay on track.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}