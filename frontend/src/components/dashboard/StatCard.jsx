import Card from "../common/Card";

export default function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}) {
  const isZero = value === 0 || value === "0" || value === "0%" || value === "0 kcal";

  return (
    <Card className="hover:border-cyan-500 transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wide">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

          <p className={`text-sm mt-3 ${isZero ? "text-[var(--text-secondary)]" : "text-green-500"}`}>
            {isZero ? subtitle || "Start logging data to see progress" : "↑ +12% this week"}
          </p>

        </div>

        <div className="text-4xl p-3 rounded-xl theme-surface-soft backdrop-blur-xl">
          {icon}
        </div>

      </div>

    </Card>
  );
}