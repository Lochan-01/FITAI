import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../services/api";
import CyberGauge from "../components/dashboard/CyberGauge";
import AuraRunner from "../components/dashboard/AuraRunner";
import { useNavigate } from "react-router-dom";

import {
  FaFire,
  FaWeight,
  FaDumbbell,
  FaBullseye,
  FaBrain,
  FaHeartbeat,
  FaRunning,
  FaEllipsisV,
  FaClock,
  FaCalendarAlt,
  FaBolt,
  FaCheckCircle,
  FaCogs,
} from "react-icons/fa";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components for line graphs
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const zeroSummary = {
    cards: {
      calories: { title: "Calories", value: 0, subtitle: "Estimated daily burn", unit: "kcal" },
      bmi: { title: "BMI", value: 0, subtitle: "Based on current profile", unit: "" },
      workouts: { title: "Workouts", value: 0, subtitle: "Completed sessions", unit: "" },
      goal: { title: "Goal", value: 0, subtitle: "Progress toward target", unit: "%" },
    },
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
    recommendations: { workout: "-", protein: "0 g", water: "0 liters", calories: "0 kcal", score: 0 },
    historyCount: 0,
  };

  const [summary, setSummary] = useState(zeroSummary);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data.summary);
      } catch (err) {
        console.warn("Failed to load dashboard summary:", err);
      }
    };

    loadSummary();
  }, []);

  const cards = summary.cards;
  const recommendations = summary.recommendations;
  const recoveryScoreVal = summary.analytics.cards[2]?.value ? parseInt(summary.analytics.cards[2].value) : 85;

  // Chart data configuration for the monthly progress line chart at the bottom of forecast
  const chartLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const chartValues = [120, 150, 180, 160, 210, 240, 230, 280, 310, 305, 340, 380]; // Mock monthly data showing solid training volume

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Performance",
        data: chartValues,
        fill: true,
        borderColor: "#06b6d4",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.08)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { size: 9 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#94a3b8", font: { size: 9 } },
        grid: { color: "rgba(71, 85, 105, 0.15)" },
      },
    },
  };

  return (
    <DashboardLayout>
      {/* Embedded style tags for high-tech cyberpunk CSS elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .cyber-panel {
          background: linear-gradient(135deg, rgba(16, 22, 37, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%);
          border: 1px solid rgba(6, 182, 212, 0.2);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.06), inset 0 0 15px rgba(6, 182, 212, 0.06);
          position: relative;
          overflow: hidden;
        }
        .cyber-panel::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent);
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        .cyber-glow-text {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        .cyber-glow-text-orange {
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
        }
        .clip-hex-card {
          clip-path: polygon(8% 0%, 92% 0%, 100% 25%, 100% 75%, 92% 100%, 8% 100%, 0% 75%, 0% 25%);
        }
        .clip-hex-badge {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}} />

      {/* Main Grid matching mock layout: 3 columns (Left 3/12, Middle 6/12, Right 3/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4 select-none text-slate-100">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Logo & Brand Card */}
          <div className="cyber-panel rounded-3xl p-6 flex flex-col items-center">
            {/* Main Circle FITAI Logo */}
            <div 
              onClick={() => navigate("/chatbot")} 
              className="cursor-pointer group flex flex-col items-center"
            >
              <div className="relative w-36 h-36 rounded-full border-4 border-cyan-500/30 flex items-center justify-center p-2 bg-slate-900/50 shadow-[0_0_25px_rgba(6,182,212,0.2)] group-hover:border-cyan-400 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-600/20 to-indigo-600/25 flex items-center justify-center relative overflow-hidden">
                  <FaRunning className="text-5xl text-cyan-400 animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                </div>
              </div>
              
              <h1 className="mt-4 text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
                FIT<span className="text-amber-500 font-medium">AI</span>
              </h1>
              <p className="text-xs tracking-[0.4em] uppercase text-slate-400 font-semibold mt-1 group-hover:text-cyan-300 transition-colors duration-300">
                Train Smarter
              </p>
            </div>

            {/* Micro circular badges row */}
            <div className="flex items-center justify-between w-full mt-8 px-2">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-cyan-500/35 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <FaRunning className="text-cyan-400 text-lg animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">FITAI</span>
              </div>

              {/* Central Hexagon Badge (Displaying calories/activity stats) */}
              <div className="clip-hex-badge bg-gradient-to-br from-slate-900 to-slate-950 border-y border-cyan-500/40 w-24 h-14 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  {cards.calories.value}
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none font-bold">
                  KCAL
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-indigo-500/35 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <FaBrain className="text-indigo-400 text-lg animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">BRAIN</span>
              </div>
            </div>
          </div>

          {/* Smart Recovery Nexus Widget */}
          <div className="cyber-panel rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4 border-b border-cyan-500/10 pb-3">
              <h2 className="text-lg font-bold tracking-wider text-cyan-400 uppercase">
                Smart Recovery Nexus
              </h2>
              <FaEllipsisV className="text-slate-400 text-sm cursor-pointer hover:text-cyan-400" />
            </div>

            {/* SVG body heatmap representation */}
            <div className="flex justify-center items-center py-2 bg-white/5 rounded-2xl border border-white/10 relative">
              <svg viewBox="0 0 100 200" className="w-full h-44 drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                {/* Sleek outline of human head & core */}
                <circle cx="50" cy="22" r="10" fill="none" stroke="#6366f1" strokeWidth="2" />
                <line x1="50" y1="32" x2="50" y2="105" stroke="#6366f1" strokeWidth="2" />
                {/* Shoulders & arms */}
                <line x1="28" y1="44" x2="72" y2="44" stroke="#6366f1" strokeWidth="2" />
                <line x1="28" y1="44" x2="18" y2="95" stroke="#6366f1" strokeWidth="2" />
                <line x1="72" y1="44" x2="82" y2="95" stroke="#6366f1" strokeWidth="2" />
                {/* Hips & legs */}
                <line x1="33" y1="105" x2="67" y2="105" stroke="#6366f1" strokeWidth="2" />
                <line x1="33" y1="105" x2="28" y2="175" stroke="#6366f1" strokeWidth="2" />
                <line x1="67" y1="105" x2="72" y2="175" stroke="#6366f1" strokeWidth="2" />
                
                {/* Muscle soreness/recovery glowing hotspots */}
                <circle cx="50" cy="60" r="12" fill="#ef4444" fillOpacity="0.45" className="animate-pulse" /> {/* Chest/Core */}
                <circle cx="28" cy="44" r="8" fill="#f59e0b" fillOpacity="0.4" /> {/* Left shoulder */}
                <circle cx="72" cy="44" r="8" fill="#f59e0b" fillOpacity="0.4" /> {/* Right shoulder */}
                <circle cx="28" cy="135" r="9" fill="#10b981" fillOpacity="0.35" /> {/* Left Quad */}
                <circle cx="72" cy="135" r="9" fill="#10b981" fillOpacity="0.35" /> {/* Right Quad */}
              </svg>
              
              {/* Heatmap color guide absolute inside card */}
              <div className="absolute bottom-2 left-2 flex flex-col gap-1 text-[8px] text-slate-400 font-bold bg-slate-900/60 p-2 rounded border border-slate-800">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Muscle Soreness</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Recovering</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fully Rested</div>
              </div>
            </div>

            {/* Calendars row */}
            <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-cyan-500/10 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  <FaCalendarAlt className="text-cyan-400 text-xs" /> CALENDAR 1
                </p>
                {/* Micro calendar grid 7 cols x 4 rows */}
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-sm ${
                        i % 5 === 0 
                          ? "bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" 
                          : i % 7 === 3 
                          ? "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" 
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  <FaCalendarAlt className="text-amber-500 text-xs" /> CALENDAR 2
                </p>
                {/* Micro calendar grid 2 */}
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-sm ${
                        i % 4 === 1 
                          ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" 
                          : i % 8 === 0 
                          ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" 
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MIDDLE COLUMN ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Quick Metrics Header Row */}
          <div className="cyber-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">AGE</span>
              <span className="text-sm font-black text-cyan-400 cyber-glow-text">24</span>
            </div>

            <div className="w-[1px] h-6 bg-white/15 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">REC</span>
              <span className="text-sm font-black text-amber-500 cyber-glow-text-orange">36 hrs</span>
            </div>

            <div className="w-[1px] h-6 bg-white/15 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">AVG</span>
              <span className="text-sm font-black text-yellow-500">3.5 hrs</span>
            </div>

            <div className="w-[1px] h-6 bg-white/15 hidden md:block"></div>

            {/* Small circular SVG progress representation (SHORSITE) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">SHORSITE</span>
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400"
                    strokeDasharray="72, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[8px] font-black text-slate-200">72%</span>
              </div>
            </div>

            <div className="w-[1px] h-6 bg-white/15 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">LMSIGHT</span>
              <span className="text-sm font-black text-cyan-400 cyber-glow-text">30%</span>
            </div>

            <div className="w-[1px] h-6 bg-white/15 hidden md:block"></div>

            <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-[11px] px-5 py-1.5 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.4)] tracking-wide uppercase hover:opacity-90 transition duration-300">
              2485 MP/H
            </div>
          </div>

          {/* AI Fitness Forecast Widget (Main Screen with central AuraRunner) */}
          <div className="cyber-panel rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-500/10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-400 uppercase">
                  AI Fitness Forecast
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                  Dynamic performance metrics and active overlays
                </p>
              </div>
              <FaEllipsisV className="text-slate-400 text-sm cursor-pointer hover:text-cyan-400" />
            </div>

            {/* Central area: Layout with stats overlaid on Left, AuraRunner in middle, Performance graphs on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Overlaid stats - Left (4/12 width) */}
              <div className="md:col-span-3 space-y-4">
                <div className="border-l-2 border-cyan-500 pl-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">REAL TIME WORKOUTS</p>
                  <h3 className="text-xl font-black text-white leading-none mt-1">
                    {cards.workouts.value} sessions
                  </h3>
                </div>

                <div className="border-l-2 border-indigo-500 pl-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HEALTH INDEX (BMI)</p>
                  <h3 className="text-xl font-black text-white leading-none mt-1">
                    {cards.bmi.value}
                  </h3>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BIOMETRIC FUEL</p>
                  <h3 className="text-xl font-black text-white leading-none mt-1">
                    {recommendations.protein}
                  </h3>
                </div>

                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">INTENSITY LEVEL</p>
                  <h3 className="text-xs font-bold text-white mt-1 leading-tight">
                    {summary.analytics.cards[0]?.note || "Active Training"}
                  </h3>
                </div>
              </div>

              {/* Central AuraRunner - Middle (6/12 width) */}
              <div className="md:col-span-6 relative flex justify-center items-center">
                <AuraRunner />
                
                {/* Dynamic dial on bottom-left of runner */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-slate-950/80 border border-cyan-500/20 px-2 py-1 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-[10px] font-extrabold text-cyan-300 tracking-wider">95% MAX POWER</span>
                </div>
              </div>

              {/* Performance sparkline + Range of Motion on Right (2/12 width) */}
              <div className="md:col-span-3 flex flex-col items-start justify-center space-y-5 md:pl-3">
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PERFORMANCE</span>
                  <h4 className="text-lg font-black text-cyan-400 leading-none mt-1">
                    50.10%
                  </h4>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Projected</span>
                </div>
                
                {/* Mini graphical indicator lines */}
                <div className="w-full h-8 flex items-end gap-1 px-1 bg-slate-950/40 rounded-lg border border-slate-800/40">
                  <div className="w-full bg-cyan-500/40 h-[20%] rounded-sm"></div>
                  <div className="w-full bg-cyan-500/50 h-[35%] rounded-sm"></div>
                  <div className="w-full bg-cyan-500/60 h-[50%] rounded-sm"></div>
                  <div className="w-full bg-cyan-500/80 h-[65%] rounded-sm"></div>
                  <div className="w-full bg-cyan-500 h-[85%] rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                </div>

                <div className="border-t border-slate-800 pt-3 w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FLEXIBILITY</span>
                  <h4 className="text-xl font-black text-white leading-none mt-1">
                    38 ROM
                  </h4>
                </div>
              </div>

            </div>

            {/* Bottom Monthly Progress Line Chart */}
            <div className="mt-6 pt-4 border-t border-cyan-500/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">MONTHLY TRAINING LOAD (kcal/day)</span>
                <span className="text-[10px] text-slate-400 font-bold">JANUARY - DECEMBER TREND</span>
              </div>
              <div className="h-28">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>

          </div>

          {/* Bottom row of 3 polygonal/faceted cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="cyber-panel clip-hex-card p-5 text-center flex flex-col justify-center min-h-[90px] border border-cyan-500/20 hover:border-cyan-400/40 transition duration-300">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">ACTIVE INDEX</span>
              <h4 className="text-lg font-black text-cyan-400 mt-1 cyber-glow-text">253.9M</h4>
              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">REST RATIO: 2.39</span>
            </div>

            <div className="cyber-panel clip-hex-card p-5 text-center flex flex-col justify-center min-h-[90px] border border-indigo-500/20 hover:border-indigo-400/40 transition duration-300">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">SORENESS LEVEL</span>
              <h4 className="text-2xl font-black text-indigo-400 mt-1">216</h4>
              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">OPTIMAL STAGE</span>
            </div>

            <div className="cyber-panel clip-hex-card p-5 text-center flex flex-col justify-center min-h-[90px] border border-emerald-500/20 hover:border-emerald-400/40 transition duration-300">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">REP VOLUME</span>
              <h4 className="text-lg font-black text-emerald-400 mt-1">3,050</h4>
              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">FAT BURN: 28.7%</span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Personalized Performance Plan Card */}
          <div className="cyber-panel rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-500/10">
              <h2 className="text-lg font-bold tracking-wider text-cyan-400 uppercase">
                Performance Plan
              </h2>
              <FaEllipsisV className="text-slate-400 text-sm cursor-pointer hover:text-cyan-400" />
            </div>

            {/* Goal info */}
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <FaBullseye className="text-cyan-400 text-sm" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Goal</span>
                </div>
                <h3 className="text-md font-extrabold text-white mt-1">
                  {recommendations.workout}
                </h3>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <FaClock className="text-indigo-400 text-sm" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Focus</span>
                </div>
                <h3 className="text-md font-extrabold text-white mt-1">
                  Peak Distance & Endurance
                </h3>
              </div>

              {/* Progress track */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase">
                  <span>Goal Completion</span>
                  <span className="text-cyan-400">{cards.goal.value}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 border border-slate-700/60 p-0.5">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    style={{ width: `${cards.goal.value}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline / Milestones */}
              <div className="pt-3 border-t border-cyan-500/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Upcoming Milestones</span>
                <div className="space-y-4 pl-2.5 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                  <div className="relative pl-4">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">WFFK 17</p>
                    <p className="text-xs text-white font-extrabold mt-0.5">20-mile long run test</p>
                  </div>
                  <div className="relative pl-4">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Week 14</p>
                    <p className="text-xs text-white font-extrabold mt-0.5">Track interval & speed sessions</p>
                  </div>
                  <div className="relative pl-4">
                    <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Week 16</p>
                    <p className="text-xs text-slate-400 font-extrabold mt-0.5">Taper week start & body reset</p>
                  </div>
                </div>
              </div>

              {/* View Full Plan Button */}
              <button 
                onClick={() => navigate("/workout")}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition duration-300 cursor-pointer"
              >
                View Full Plan Details
              </button>

            </div>
          </div>

          {/* AI Plan Adherence (Gauge Card) */}
          <div className="cyber-panel rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-500/10">
              <h2 className="text-lg font-bold tracking-wider text-cyan-400 uppercase">
                AI Plan Adherence
              </h2>
              <FaEllipsisV className="text-slate-400 text-sm cursor-pointer hover:text-cyan-400" />
            </div>

            {/* Custom CyberGauge rendering recommendations.score */}
            <div className="py-4">
              <CyberGauge value={recommendations.score || 89} />
            </div>

            {/* Compliance Stats Info */}
            <div className="space-y-3 mt-4 pt-3 border-t border-cyan-500/10">
              <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Plan Compliance</span>
                <span className="text-emerald-400 font-black tracking-wider">+9.20%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Recovery Score</span>
                <span className="text-cyan-400 font-black tracking-wider">{recoveryScoreVal}%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Target Adherence</span>
                <span className="text-indigo-400 font-black tracking-wider">Optimal Match</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Full-Width Section to fill empty space when scrolled */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 select-none text-slate-100 pb-8">
        
        {/* Card 1: Neural Fitness Insights Log */}
        <div className="lg:col-span-8 cyber-panel rounded-3xl p-6">
          <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-4">
            <FaCogs className="text-xl animate-spin [animation-duration:20s]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Neural Engine & Real-Time Bio Log</h2>
          </div>
          
          <div className="space-y-3 font-mono text-[10px] text-slate-400 bg-slate-950/60 p-4 border border-slate-800/40 rounded-2xl max-h-[140px] overflow-y-auto">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
              <span className="text-cyan-400 font-bold">[12:00 PM]</span>
              <span className="text-emerald-400 font-extrabold uppercase">[BIOMETRICS]</span>
              <span>Heartrate stabilized at 72 BPM. Energy levels optimal.</span>
            </div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
              <span className="text-cyan-400 font-bold">[11:45 AM]</span>
              <span className="text-indigo-400 font-extrabold uppercase">[COACH ALERT]</span>
              <span>Protein intake status checked. Target: {recommendations.protein}.</span>
            </div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
              <span className="text-cyan-400 font-bold">[10:30 AM]</span>
              <span className="text-amber-500 font-extrabold uppercase">[PLAN MATCH]</span>
              <span>Active adherence rate score set to {recommendations.score || 89}%. Optimal training alignment.</span>
            </div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5">
              <span className="text-cyan-400 font-bold">[09:15 AM]</span>
              <span className="text-rose-500 font-extrabold uppercase">[SENSORY LOG]</span>
              <span>Soreness index checked. Fatigue: 3/10, Stress: 3/10. Ready for lifting.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">[08:00 AM]</span>
              <span className="text-cyan-400 font-extrabold uppercase">[SYSTEM]</span>
              <span>FastAPI database loaded. All workout neural models active and online.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Biometric Target Matrix */}
        <div className="lg:col-span-4 cyber-panel rounded-3xl p-6">
          <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-3 mb-4">
            <FaBullseye className="text-xl" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Daily Goal Targets</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-3 border border-slate-800 rounded-xl text-center flex flex-col justify-center min-h-[90px]">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Active Burn</span>
              <h4 className="text-md font-black text-cyan-400 mt-1">{cards.calories.value} kcal</h4>
              <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="bg-slate-950/40 p-3 border border-slate-800 rounded-xl text-center flex flex-col justify-center min-h-[90px]">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Workouts Done</span>
              <h4 className="text-md font-black text-indigo-400 mt-1">{cards.workouts.value} sessions</h4>
              <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}