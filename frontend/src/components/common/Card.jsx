import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 0 25px rgba(6,182,212,0.15)",
        borderColor: "rgba(6, 182, 212, 0.4)",
      }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-3xl p-6 transition-colors duration-300
        bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)] 
        border border-cyan-500/20 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.03)]
        before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px]
        before:bg-gradient-to-r before:from-transparent before:via-cyan-500/35 before:to-transparent
        ${className}`}
    >
      {/* Decorative cyber grid corner accent */}
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-400/30" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-400/30" />
      {children}
    </motion.div>
  );
}