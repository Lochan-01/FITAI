import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRunning, FaAppleAlt, FaBrain, FaWeight } from "react-icons/fa";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numWaves = 3;
    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render flowing 3D particle waves
      for (let w = 0; w < numWaves; w++) {
        const density = 40;
        const waveHeight = 60 + w * 25;
        const frequency = 0.0028 - w * 0.0005;

        for (let i = 0; i < width + 50; i += density) {
          // Complex trig calculation to simulate 3D mesh curvature
          const y =
            height * 0.6 +
            Math.sin(i * frequency + phase + w * 2.2) * waveHeight +
            Math.cos(i * 0.007 - phase) * (waveHeight * 0.35);

          // Perspective depth scaling
          const depthScale = Math.max(0.1, 1 - (w * 0.22));
          const size = Math.max(0.8, (2.0 * depthScale) + Math.sin(i * 0.012 + phase) * 0.6);
          const alpha = Math.max(0.05, (0.42 * depthScale) + Math.cos(i * 0.006 + phase) * 0.12);

          ctx.fillStyle =
            w === 0
              ? `rgba(6, 182, 212, ${alpha})`    // Glowing Cyan
              : w === 1
              ? `rgba(99, 102, 241, ${alpha})`    // Indigo-Blue
              : `rgba(168, 85, 247, ${alpha})`;   // Neon Purple

          ctx.beginPath();
          ctx.arc(i, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Connect mesh splines dynamically (every third point gets a vertical connection)
          if (i % (density * 3) === 0) {
            ctx.strokeStyle = w === 0 ? `rgba(6, 182, 212, ${alpha * 0.15})` : `rgba(99, 102, 241, ${alpha * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(i, y);
            ctx.lineTo(i, y + 160);
            ctx.stroke();
          }
        }
      }

      phase += 0.004;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020306] overflow-x-hidden text-slate-100 font-sans select-none flex flex-col justify-between">
      
      {/* Background Motion Mesh Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      {/* Grid overlay for cyberpunk feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-5 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-500/10">
            <FaRunning className="text-cyan-400 text-sm animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Fit<span className="text-white">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition duration-300 cursor-pointer">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:opacity-90 transition duration-300 cursor-pointer">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Central Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 pt-10 pb-6">
        
        {/* Heading & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider text-white filter drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            Your AI Fitness Coach
          </h1>
          <p className="mt-3.5 text-sm md:text-md uppercase tracking-[0.35em] text-cyan-400 font-bold">
            Workout Detection &bull; Diet Planning &bull; AI Chatbot &bull; BMI Analysis
          </p>
        </div>

        {/* ================= 3D PREVIEW PANELS CAROUSEL ================= */}
        <div className="relative flex flex-wrap justify-center items-center gap-6 mt-16 max-w-7xl mx-auto px-4 perspective-[1500px] preserve-3d pb-12">
          
          <style dangerouslySetInnerHTML={{ __html: `
            .perspective-card {
              transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
              transform-style: preserve-3d;
            }
            .card-float-1 { animation: float-1 6s ease-in-out infinite; }
            .card-float-2 { animation: float-2 6.5s ease-in-out infinite; }
            .card-float-3 { animation: float-3 7s ease-in-out infinite; }
            .card-float-4 { animation: float-4 7.5s ease-in-out infinite; }
            
            @keyframes float-1 { 0%, 100% { transform: perspective(1000px) rotateY(18deg) translateY(0px) translateZ(0); } 50% { transform: perspective(1000px) rotateY(18deg) translateY(-8px) translateZ(10px); } }
            @keyframes float-2 { 0%, 100% { transform: perspective(1000px) rotateY(8deg) translateY(0px) translateZ(10px); } 50% { transform: perspective(1000px) rotateY(8deg) translateY(-10px) translateZ(25px); } }
            @keyframes float-3 { 0%, 100% { transform: perspective(1000px) rotateY(-8deg) translateY(0px) translateZ(10px); } 50% { transform: perspective(1000px) rotateY(-8deg) translateY(-8px) translateZ(25px); } }
            @keyframes float-4 { 0%, 100% { transform: perspective(1000px) rotateY(-18deg) translateY(0px) translateZ(0); } 50% { transform: perspective(1000px) rotateY(-18deg) translateY(-10px) translateZ(10px); } }

            .perspective-card:hover {
              transform: perspective(1000px) rotateY(0deg) scale(1.06) translateZ(40px) !important;
              border-color: rgba(6, 182, 212, 0.4) !important;
              box-shadow: 0 0 30px rgba(6, 182, 212, 0.25) !important;
              animation-play-state: paused !important;
            }
          ` }} />

          {/* CARD 1: Workout Detection */}
          <div className="perspective-card card-float-1 w-64 h-[19rem] rounded-2xl bg-slate-950/80 border border-cyan-500/25 p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(6,182,212,0.05)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">01 / WORKOUT DETECT</span>
              <FaRunning className="text-cyan-400 text-xs" />
            </div>

            {/* Wireframe and Stats Grid */}
            <div className="flex items-center justify-between my-2">
              <div className="text-[8px] text-slate-400 font-mono space-y-1">
                <div>Telemetry: <span className="text-white">2308</span></div>
                <div>Grip: <span className="text-white">45.6</span></div>
                <div>Situps: <span className="text-white">42/min</span></div>
                <div>Intensity: <span className="text-cyan-400">92%</span></div>
              </div>

              {/* Glowing joints wireframe */}
              <div className="relative">
                <svg viewBox="0 0 100 120" className="w-20 h-28 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  <line x1="50" y1="20" x2="50" y2="60" stroke="#06b6d4" strokeWidth="1.5" />
                  <line x1="30" y1="35" x2="70" y2="35" stroke="#06b6d4" strokeWidth="1.5" />
                  <line x1="30" y1="35" x2="22" y2="62" stroke="#06b6d4" strokeWidth="1.5" />
                  <line x1="70" y1="35" x2="78" y2="62" stroke="#06b6d4" strokeWidth="1.5" />
                  <line x1="50" y1="60" x2="38" y2="92" stroke="#06b6d4" strokeWidth="1.5" />
                  <line x1="50" y1="60" x2="62" y2="92" stroke="#06b6d4" strokeWidth="1.5" />
                  <circle cx="50" cy="18" r="4.5" fill="#6366f1" />
                  <circle cx="30" cy="35" r="2.5" fill="#06b6d4" />
                  <circle cx="70" cy="35" r="2.5" fill="#06b6d4" />
                  <circle cx="22" cy="62" r="2.5" fill="#06b6d4" />
                  <circle cx="78" cy="62" r="2.5" fill="#06b6d4" />
                  <circle cx="38" cy="92" r="2.5" fill="#06b6d4" />
                  <circle cx="62" cy="92" r="2.5" fill="#06b6d4" />
                </svg>
              </div>
            </div>

            {/* Bottom logs */}
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-[9px] font-mono text-slate-400 text-left">
              <span className="text-cyan-400">&gt;_ AI Tracker Active</span>
              <div className="truncate mt-0.5">Adherence predicted: 87.5%</div>
            </div>
          </div>

          {/* CARD 2: Diet Plan */}
          <div className="perspective-card card-float-2 w-64 h-[19rem] rounded-2xl bg-slate-950/80 border border-cyan-500/25 p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(6,182,212,0.05)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">02 / DIET PLANNER</span>
              <FaAppleAlt className="text-emerald-400 text-xs" />
            </div>

            {/* Pie Chart & Food indicators */}
            <div className="flex items-center justify-between my-2">
              {/* Pie Ring SVG */}
              <div className="relative">
                <svg viewBox="0 0 100 100" className="w-20 h-20 transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="60" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="140" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="210" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[8px] font-bold text-slate-300">
                  <span>KCAL</span>
                  <span className="text-cyan-400 font-black text-[10px]">1950</span>
                </div>
              </div>

              {/* Grid of logged days */}
              <div className="space-y-1.5 pl-3">
                <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">November</div>
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-sm ${i % 3 === 0 ? 'bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.6)]' : 'bg-slate-800'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Diet indicators */}
            <div className="flex items-center justify-around gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-xs text-white">
              <span>🍎</span>
              <span>🍗</span>
              <span>🥦</span>
              <span>🍊</span>
            </div>
          </div>

          {/* CARD 3: AI Chatbot */}
          <div className="perspective-card card-float-3 w-64 h-[19rem] rounded-2xl bg-slate-950/80 border border-cyan-500/25 p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(6,182,212,0.05)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">03 / AI COACH CHAT</span>
              <FaBrain className="text-indigo-400 text-xs" />
            </div>

            {/* Robot face and chat bubble */}
            <div className="flex flex-col items-center justify-center my-2 gap-3">
              {/* Smiling Robot screen SVG */}
              <svg viewBox="0 0 100 80" className="w-18 h-15 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                <rect x="15" y="10" width="70" height="55" rx="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
                <rect x="23" y="18" width="54" height="38" rx="8" fill="#1b253b" />
                {/* Smiley curves */}
                <path d="M 33 32 Q 38 27 43 32" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
                <path d="M 57 32 Q 62 27 67 32" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
                <path d="M 44 44 Q 50 48 56 44" stroke="#6366f1" strokeWidth="2.5" fill="none" />
                <circle cx="50" cy="5" r="3" fill="#6366f1" />
                <line x1="50" y1="10" x2="50" y2="5" stroke="#06b6d4" strokeWidth="1.5" />
              </svg>

              <div className="w-full bg-slate-900/60 border border-white/5 rounded-xl p-2 text-[9px] text-slate-300 leading-relaxed font-mono">
                💬 Ask about diets, workout posture, and dynamic injury risk prediction!
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[8px] font-mono text-cyan-400 bg-cyan-500/5 px-2.5 py-1.5 rounded-lg border border-cyan-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>AI Agent Online: 100% Responsive</span>
            </div>
          </div>

          {/* CARD 4: BMI Trend */}
          <div className="perspective-card card-float-4 w-64 h-[19rem] rounded-2xl bg-slate-950/80 border border-cyan-500/25 p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(6,182,212,0.05)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">04 / BMI ANALYSIS</span>
              <FaWeight className="text-cyan-400 text-xs" />
            </div>

            {/* Trend Graph & Tape Measure */}
            <div className="my-2">
              <div className="flex items-center justify-between mb-3.5">
                <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="block text-[7px] uppercase font-bold text-slate-500">Latest BMI</span>
                  <span className="text-xs font-black text-cyan-400">22.5%</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  <span className="block text-[7px] uppercase font-bold text-slate-500">Trend Change</span>
                  <span className="text-xs font-black text-emerald-400">-0.4</span>
                </div>
              </div>

              {/* Sparkline trend SVG */}
              <div className="w-full h-12 bg-slate-950/60 border border-white/5 rounded-xl flex items-end p-1 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 15 L 100 40 L 0 40 Z" fill="rgba(6,182,212,0.06)" />
                  <path d="M 0 35 Q 20 20 40 28 T 80 12 T 100 15" stroke="#06b6d4" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>

            {/* Tape measure decoration */}
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 text-[8px] font-mono text-amber-500/90 tracking-widest uppercase">
              📏 Tape scale index: 32.5cm Core
            </div>
          </div>

        </div>

        {/* ================= GET STARTED PORTAL BUTTON ================= */}
        <div className="relative mt-8 group flex items-center justify-center w-52 h-52">
          
          {/* Animated portal background rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/30 animate-[spin_10s_linear_infinite] group-hover:scale-105 transition-all duration-500" />
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/20 group-hover:border-cyan-500/40 animate-[spin_18s_linear_infinite_reverse]" />
          
          {/* Glowing teal portal overlay rings */}
          <div className="absolute inset-4 rounded-full border border-double border-cyan-400/35 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-[pulse_3s_ease-in-out_infinite]" />
          
          {/* Center Button Capsule */}
          <Link to="/dashboard" className="relative z-10">
            <button className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] transition duration-500 scale-100 group-hover:scale-105 cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-20 w-full text-center py-4 border-t border-white/5 bg-slate-950/20 text-[10px] text-slate-500 uppercase tracking-widest">
        FitAI &copy; {new Date().getFullYear()} &bull; Cyber-Engine V2.0
      </footer>

    </div>
  );
}