import {
  FaHome,
  FaChartLine,
  FaWeight,
  FaAppleAlt,
  FaDumbbell,
  FaRobot,
  FaCheckCircle,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaCamera
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useRef } from "react";

export default function Sidebar({ isOpen, onClose }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { isLight } = useTheme();
  const menuScrollRef = useRef(null);

  useEffect(() => {
    const storedScrollTop = sessionStorage.getItem("sidebar-scroll-top");

    if (menuScrollRef.current && storedScrollTop !== null) {
      menuScrollRef.current.scrollTop = Number(storedScrollTop);
    }

    return () => {
      if (menuScrollRef.current) {
        sessionStorage.setItem("sidebar-scroll-top", String(menuScrollRef.current.scrollTop));
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
    { name: "BMI", icon: <FaWeight />, path: "/bmi" },
    { name: "Diet Planner", icon: <FaAppleAlt />, path: "/diet" },
    { name: "Habit Tracker", icon: <FaCheckCircle />, path: "/habit" },
    { name: "Workout", icon: <FaDumbbell />, path: "/workout" },
    { name: "Pose Detection", icon: <FaCamera />, path: "/pose" },
    { name: "AI Coach", icon: <FaRobot />, path: "/chatbot" },
    { name: "History", icon: <FaHistory />, path: "/history" },
    { name: "Settings", icon: <FaCog />, path: "/settings" }
  ];

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-label="Close sidebar overlay"
      />

      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r theme-surface shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

      <div className="flex items-center justify-center border-b border-[var(--border)] p-6">

  <img
    src={logo}
    alt="FitAI Logo"
    className={`h-30 w-30 object-contain ${isLight ? "brightness-0" : ""}`}
  />

</div>

      <div ref={menuScrollRef} className="flex-1 min-h-0 overflow-y-auto p-5">

        {menu.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `mb-2 flex w-full items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 ${
                isActive
                        ? "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-primary)] shadow-lg shadow-black/5"
                        : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
              }`
            }
          >
            <span className="text-xl transition-colors duration-300">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>

        ))}

      </div>

      <div className="border-t border-[var(--border)] p-6">

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      </aside>
    </>
  );
}