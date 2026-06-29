import React from "react";

export default function CyberGauge({ value = 75 }) {
  // Cap value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate rotation angle for the needle/pointer
  // 0% corresponds to -90 degrees (pointing left)
  // 100% corresponds to 90 degrees (pointing right)
  const angle = (normalizedValue / 100) * 180 - 90;

  // Arc path parameters for a semi-circle
  // Radius = 80, Center = (100, 90)
  // Path starts at (20, 90) and ends at (180, 90)
  // Using SVG stroke-dasharray/stroke-dashoffset to draw the progress:
  // Semi-circle circumference = PI * r = 3.14159 * 80 ≈ 251.3
  const r = 70;
  const circumference = Math.PI * r;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg className="w-48 h-28" viewBox="0 0 200 110">
        <defs>
          {/* Cyber Grad */}
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" /> {/* Orange/Red */}
            <stop offset="50%" stopColor="#f59e0b" /> {/* Yellow */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <stop offset="0%" stopColor="#06b6d4" />
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Track */}
        <path
          d={`M 30 95 A ${r} ${r} 0 0 1 170 95`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Glowing Active Track */}
        <path
          d={`M 30 95 A ${r} ${r} 0 0 1 170 95`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />

        {/* Center hub */}
        <circle cx="100" cy="95" r="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        
        {/* Needle pointing to value */}
        <line
          x1="100"
          y1="95"
          x2="100"
          y2="35"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 100 95)`}
          style={{
            transformOrigin: "100px 95px",
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Accent tick marks */}
        <line x1="30" y1="95" x2="22" y2="95" stroke="#475569" strokeWidth="2" />
        <line x1="170" y1="95" x2="178" y2="95" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="25" x2="100" y2="17" stroke="#475569" strokeWidth="2" />
      </svg>
      
      {/* Percentage Text overlaid in the middle of the gauge */}
      <div className="absolute bottom-2 flex flex-col items-center">
        <span className="text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
          {value}%
        </span>
      </div>
    </div>
  );
}
