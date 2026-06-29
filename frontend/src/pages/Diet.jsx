import { useState } from "react";
import { FaAppleAlt, FaDrumstickBite, FaSpinner, FaTint } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

const initialForm = {
  age: 28,
  gender: "Male",
  height_cm: 176,
  weight_kg: 72,
  goal: "Weight Loss",
};

export default function Diet() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/diet/recommend", {
        age: Number(form.age),
        gender: form.gender,
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        goal: form.goal,
      });

      setPlan(response.data);

      // Save to history log
      try {
        await api.post("/history", {
          title: `Diet Plan: ${form.goal}`,
          status: "Logged",
          details: `Generated diet plan targeting ${response.data.estimated_daily_calories} kcal/day for a ${form.weight_kg}kg ${form.gender}.`,
          icon: "meal",
          color: "text-emerald-400"
        });
      } catch (historyErr) {
        console.error("Failed to post diet to history log", historyErr);
      }
    } catch (err) {
      setPlan(null);
      setError(err.response?.data?.detail || "Unable to generate a diet plan right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-100 select-none">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">Nutrition Plan</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">Diet Planner</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Build meals around your calorie target and fitness goal with recommendations pulled from your diet dataset.
            </p>
          </div>
        </div>

        {/* Input Parameters Form Card */}
        <Card className="border border-cyan-500/10 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Age</span>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
            </label>
            <label className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Height (cm)</span>
              <input
                type="number"
                name="height_cm"
                value={form.height_cm}
                onChange={handleChange}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
            </label>
            <label className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Weight (kg)</span>
              <input
                type="number"
                name="weight_kg"
                value={form.weight_kg}
                onChange={handleChange}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              />
            </label>
            <label className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest md:col-span-2">
              <span>Goal</span>
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintain">Maintain</option>
                <option value="Muscle Gain">Muscle Gain</option>
              </select>
            </label>
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition duration-300 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {loading ? <FaSpinner className="animate-spin text-sm" /> : null}
                {loading ? "Generating plan..." : "Get diet recommendations"}
              </button>
            </div>
          </form>

          {error ? <p className="text-xs text-rose-400 font-bold uppercase mt-2">{error}</p> : null}
        </Card>

        {/* Results Block */}
        {plan ? (
          <div className="space-y-6">
            
            {/* Daily summary card */}
            <Card className="border border-cyan-500/10">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-400 font-bold">Daily Summary</p>
                  <h2 className="text-xl font-extrabold text-white mt-1 uppercase tracking-wider">{plan.goal}</h2>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-bold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  Estimated intake: {plan.estimated_daily_calories} kcal
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-semibold">
                We found {plan.recommendation_count} recipe suggestions across your day.
              </p>
            </Card>

            {/* Meal plans items */}
            {plan.meal_plans.map((mealPlan) => (
              <Card key={mealPlan.meal} className="border border-cyan-500/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/10 pb-3">
                  <div className="flex items-center gap-3 text-cyan-400">
                    {mealPlan.meal === "Breakfast" ? <FaAppleAlt className="text-lg" /> : mealPlan.meal === "Lunch" ? <FaDrumstickBite className="text-lg" /> : <FaTint className="text-lg" />}
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-200">{mealPlan.meal}</h3>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Target: {mealPlan.target_calories} kcal</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {mealPlan.recipes.map((recipe, index) => (
                    <div key={`${mealPlan.meal}-${recipe.name}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                      <h4 className="font-extrabold text-cyan-300 tracking-wide text-sm">{recipe.name}</h4>
                      <div className="mt-2 bg-slate-900/60 border border-slate-800 p-2 rounded-lg flex flex-wrap gap-2 text-[10px] text-slate-400 font-bold uppercase">
                        <span>Calories: <strong className="text-white">{recipe.calories}</strong></span>
                        <span>·</span>
                        <span>Protein: <strong className="text-white">{recipe.protein}g</strong></span>
                        <span>·</span>
                        <span>Carbs: <strong className="text-white">{recipe.carbs}g</strong></span>
                        <span>·</span>
                        <span>Fat: <strong className="text-white">{recipe.fat}g</strong></span>
                        <span>·</span>
                        <span>Fiber: <strong className="text-white">{recipe.fiber}g</strong></span>
                      </div>
                      <p className="mt-3 text-xs text-slate-400 font-medium leading-relaxed">
                        <strong className="text-slate-300">Ingredients:</strong> {recipe.ingredients || "Not available"}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Initial placeholder cards */
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-cyan-500/10">
              <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-4">
                <FaAppleAlt className="text-lg" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Breakfast</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Start with a balanced breakfast that fits your target calories.</p>
            </Card>
            <Card className="border border-cyan-500/10">
              <div className="flex items-center gap-3 text-amber-500 border-b border-cyan-500/10 pb-3 mb-4">
                <FaDrumstickBite className="text-lg" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Lunch</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Choose a lunch that supports steady energy and your goal.</p>
            </Card>
            <Card className="border border-cyan-500/10">
              <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-3 mb-4">
                <FaTint className="text-lg" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hydration</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Keep your day balanced with smart food choices and hydration.</p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}