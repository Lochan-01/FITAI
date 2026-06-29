import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

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
        const waveHeight = 50 + w * 20;
        const frequency = 0.003 - w * 0.0006;

        for (let i = 0; i < width + 50; i += density) {
          const y =
            height * 0.65 +
            Math.sin(i * frequency + phase + w * 2.2) * waveHeight +
            Math.cos(i * 0.008 - phase) * (waveHeight * 0.3);

          const depthScale = Math.max(0.1, 1 - (w * 0.22));
          const size = Math.max(0.8, (1.8 * depthScale) + Math.sin(i * 0.01 + phase) * 0.5);
          const alpha = Math.max(0.04, (0.38 * depthScale) + Math.cos(i * 0.005 + phase) * 0.1);

          ctx.fillStyle =
            w === 0
              ? `rgba(6, 182, 212, ${alpha})`
              : w === 1
              ? `rgba(99, 102, 241, ${alpha})`
              : `rgba(168, 85, 247, ${alpha})`;

          ctx.beginPath();
          ctx.arc(i, y, size, 0, Math.PI * 2);
          ctx.fill();

          if (i % (density * 3) === 0) {
            ctx.strokeStyle = w === 0 ? `rgba(6, 182, 212, ${alpha * 0.12})` : `rgba(99, 102, 241, ${alpha * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(i, y);
            ctx.lineTo(i, y + 140);
            ctx.stroke();
          }
        }
      }

      phase += 0.005;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login Successful");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || err.message || "Login Failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020306] overflow-hidden flex items-center justify-center px-4">
      {/* Canvas background particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />

      {/* Grid overlay for cyberpunk feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Cyberpunk login card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-cyan-500/25 p-10 bg-slate-950/80 shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-md">
        
        <h1 className="text-4xl text-center font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          FitAI Login
        </h1>

        <form className="mt-8 space-y-5" onSubmit={loginUser}>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] uppercase tracking-wider text-xs transition duration-300 cursor-pointer mt-4">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
          Don't have an account?
          <Link to="/register" className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}