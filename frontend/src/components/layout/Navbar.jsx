import { FaBell, FaMoon, FaSearch, FaSun, FaBars, FaGlobe } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { isLight, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/analytics": return "Analytics";
      case "/bmi": return "BMI";
      case "/diet": return "Diet Planner";
      case "/habit": return "Habit Tracker";
      case "/workout": return "Workout";
      case "/pose": return "Pose Detection";
      case "/chatbot": return "AI Coach";
      case "/history": return "History";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <div className="mb-3 flex items-center justify-between gap-3 select-none py-1 border-b border-cyan-500/10">

      {/* Left side: Hamburger toggle + Logo + Active view title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-cyan-500/20 text-white hover:border-cyan-400/40 cursor-pointer transition duration-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-cyan-400 text-sm" />
        </button>

        <img
          src={logo}
          alt="FitAI Logo"
          className={`h-11 w-11 object-contain ${isLight ? "brightness-0" : ""}`}
        />

        <div className="text-left leading-none pl-1">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Active View</span>
          <h1 className="text-base font-extrabold text-[var(--text-primary)] leading-tight uppercase tracking-wider">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Search + Globe + Bell + Theme toggler + Profile avatar */}
      <div className="flex items-center gap-2.5">
        
        {/* Search bar */}
        <div className="hidden md:flex items-center rounded-xl px-3 py-2 theme-input border border-cyan-500/10">
          <FaSearch className="text-slate-400 text-xs"/>
          <input
            placeholder="Search..."
            className="ml-2 w-32 bg-transparent outline-none text-[var(--input-text)] placeholder:text-slate-500 text-xs py-0.5"
          />
        </div>

        {/* Globe icon */}
        <button className="rounded-xl p-2.5 theme-surface-soft border border-cyan-500/5 transition hover:opacity-90 cursor-pointer">
          <FaGlobe className="text-md text-[var(--text-primary)]"/>
        </button>

        {/* Bell notification */}
        <button className="rounded-xl p-2.5 theme-surface-soft border border-cyan-500/5 transition hover:opacity-90 cursor-pointer">
          <FaBell className="text-md text-[var(--text-primary)]"/>
        </button>

        {/* Theme toggle switch */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 theme-surface-soft border border-cyan-500/5 transition hover:opacity-90 cursor-pointer"
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? <FaSun className="text-md text-amber-500" /> : <FaMoon className="text-md" />}
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 theme-surface-soft border border-cyan-500/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] leading-none">
              {user?.name}
            </h3>
            <span className="text-[9px] text-slate-400 font-bold block mt-1 leading-none">
              PREMIUM
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}