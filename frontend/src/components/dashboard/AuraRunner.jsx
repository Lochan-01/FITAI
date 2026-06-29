import React from "react";
import neonRunner from "../../assets/cyan_runner.jpg";

export default function AuraRunner() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[300px]">
      {/* Background neon pulsing aura spotlight */}
      <div className="absolute w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.28)_0%,transparent_70%)] blur-2xl animate-pulse" />
      <div className="absolute w-44 h-44 rounded-full border border-cyan-400/25 animate-[ping_4s_linear_infinite]" />
      
      {/* Concentric HUD rings */}
      <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-cyan-500/20 animate-[spin_30s_linear_infinite]" />
      <div className="absolute w-[270px] h-[270px] rounded-full border border-cyan-500/10 animate-[spin_50s_linear_infinite_reverse]" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-slate-800/40" />

      {/* Futuristic HUD Crosshairs */}
      <div className="absolute w-[310px] h-[1px] bg-cyan-500/10" />
      <div className="absolute h-[310px] w-[1px] bg-cyan-500/10" />

      {/* Neon runner image blending with screen mode */}
      <img
        src={neonRunner}
        alt="Neon Runner"
        className="relative z-10 h-76 w-auto object-contain select-none mix-blend-screen filter drop-shadow-[0_0_22px_rgba(6,182,212,0.8)] drop-shadow-[0_0_35px_rgba(6,182,212,0.35)] hover:scale-105 transition-transform duration-500"
      />

      {/* Glowing Dial badge matching bottom center of screenshot */}
      <div className="absolute bottom-[20px] flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/40 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-[9px] font-black text-cyan-300 tracking-widest uppercase">55% MAX POWER</span>
      </div>
    </div>
  );
}
