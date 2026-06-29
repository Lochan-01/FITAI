import Card from "../common/Card";
import { FaBolt, FaCheckCircle } from "react-icons/fa";

export default function DailyChallenge() {
	return (
		<Card className="overflow-hidden">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
						Daily Challenge
					</p>
					<h2 className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
						Finish the last 20 minutes strong
					</h2>
					<p className="mt-3 max-w-xl text-[var(--text-secondary)]">
						Close your workout streak with a short conditioning block and a quick cooldown.
					</p>
				</div>

				<div className="rounded-2xl theme-surface-soft p-4 text-cyan-500 shadow-lg shadow-cyan-500/10">
					<FaBolt className="text-2xl" />
				</div>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="rounded-2xl theme-surface-soft p-4">
					<div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
						<span>Completion</span>
						<span className="font-semibold text-emerald-500">78%</span>
					</div>
					<div className="mt-3 h-3 w-full rounded-full bg-[var(--surface-soft)]">
						<div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: "78%" }} />
					</div>
					<p className="mt-3 text-sm text-[var(--text-secondary)]">
						2 sets, 6 exercises, 1 cooldown remaining.
					</p>
				</div>

				<div className="rounded-2xl theme-surface-soft p-4">
					<p className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)]">Today&apos;s focus</p>
					<div className="mt-3 space-y-3 text-[var(--text-secondary)]">
						<div className="flex items-center gap-3">
							<FaCheckCircle className="text-emerald-500" />
							<span>15 mins HIIT finisher</span>
						</div>
						<div className="flex items-center gap-3">
							<FaCheckCircle className="text-emerald-500" />
							<span>10 min mobility reset</span>
						</div>
						<div className="flex items-center gap-3">
							<FaCheckCircle className="text-emerald-500" />
							<span>2L water before bed</span>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
