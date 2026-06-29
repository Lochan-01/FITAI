import Card from "../common/Card";
import { FaRobot } from "react-icons/fa";

export default function AIRecommendation({ data }) {
  return (
    <Card>

      <div className="theme-surface rounded-3xl p-8 shadow-xl h-full">

    <h2 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
        🤖 <span className="text-cyan-500">AI Coach</span>
    </h2>

    <div className="mt-8 space-y-5 text-lg text-[var(--text-secondary)]">

        <p>💪 Today's Focus: <span className="text-[var(--text-primary)]">{data?.workout || "Build strength + endurance"}</span></p>

        <p>🥩 Protein Goal: <span className="text-[var(--text-primary)]">{data?.protein || "150 g"}</span></p>

        <p>💧 Water Intake: <span className="text-[var(--text-primary)]">{data?.water || "3 liters"}</span></p>

        <p>🔥 Target Calories: <span className="text-[var(--text-primary)]">{data?.calories || "2200 kcal"}</span></p>

    </div>

    <hr className="border-[var(--border)] my-8"/>

    <h3 className="text-xl font-semibold text-emerald-500">
        AI Recommendation
    </h3>

    <div className="mt-4 space-y-3 text-[var(--text-secondary)]">

        <p>✔ Increase protein by <span className="text-[var(--text-primary)]">20 g</span></p>

        <p>✔ Walk <span className="text-[var(--text-primary)]">3,000</span> more steps</p>

        <p>✔ Stretch for <span className="text-[var(--text-primary)]">10 mins</span></p>

    </div>

    <hr className="border-[var(--border)] my-8"/>

    <div>

        <div className="flex justify-between mb-2">

            <span className="text-[var(--text-secondary)]">
                Today's Fitness Score
            </span>

            <span className="text-emerald-500 font-bold">
                {data?.score || 89}%
            </span>

        </div>

        <div className="w-full bg-[var(--surface-soft)] rounded-full h-3">

            <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full"
                style={{ width: `${data?.score || 89}%` }}
            ></div>

        </div>

    </div>

    <p className="mt-8 text-center text-cyan-500 font-semibold italic">
        "Small progress every day creates big results."
    </p>

</div>

    </Card>
  );
}