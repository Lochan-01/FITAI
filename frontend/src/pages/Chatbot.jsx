import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import api from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am your FitAI Assistant. I can help with workouts, nutrition, recovery, and daily motivation. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot/ask", { message: userMessage.content });
      setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I could not reach the AI coach right now." }]);
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
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 font-bold">AI Support</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">AI Coach</h1>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm">
              Ask for workout tweaks, meal changes, recovery guidance, or simple daily motivation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Main conversation section */}
          <Card className="lg:col-span-2 border border-cyan-500/10 flex flex-col min-h-[500px]">
            <div className="flex items-center gap-3 text-cyan-400 border-b border-cyan-500/10 pb-3 mb-4">
              <FaRobot className="text-xl" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Conversation</h2>
            </div>
            
            {/* Conversation window scroll container */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`rounded-2xl p-4 border transition duration-300 ${
                    message.role === "user" 
                      ? "bg-cyan-500/10 border-cyan-500/30 text-white ml-auto max-w-[85%] shadow-[0_0_10px_rgba(6,182,212,0.05)]" 
                      : "bg-slate-950/40 border-slate-800 text-slate-300 mr-auto max-w-[85%]"
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${
                    message.role === "user" ? "text-cyan-400" : "text-indigo-400"
                  }`}>
                    {message.role === "user" ? "User session" : "FitAI Coach"}
                  </p>
                  <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
              {loading && (
                <div className="rounded-2xl bg-slate-950/40 border border-slate-800 p-4 text-xs text-slate-400 font-bold uppercase tracking-widest mr-auto flex items-center gap-2 animate-pulse">
                  <FaSpinner className="animate-spin text-cyan-400" />
                  Coach is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input elements */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 rounded-xl border border-cyan-500/20 bg-slate-950/60 px-4 py-3.5 text-xs text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none placeholder:text-slate-500"
                placeholder="Ask your fitness question..."
              />
              <button onClick={sendMessage} className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:opacity-95 transition cursor-pointer">
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </Card>

          {/* Quick Prompts cards */}
          <Card className="border border-cyan-500/10">
            <div className="flex items-center gap-3 text-indigo-400 border-b border-cyan-500/10 pb-3 mb-4">
              <FaPaperPlane className="text-lg" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">Quick Prompt</h2>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">
              Send a quick query and the coach will instantly suggest routine adjustments or dietary suggestions.
            </p>
            
            <div className="space-y-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div onClick={() => setInput("What should I train today?")} className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/40 hover:border-cyan-500/30 p-3 rounded-xl cursor-pointer transition">
                • What should I train today?
              </div>
              <div onClick={() => setInput("Help me build a muscle gain meal plan.")} className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/40 hover:border-cyan-500/30 p-3 rounded-xl cursor-pointer transition">
                • Help me build a muscle gain meal plan.
              </div>
              <div onClick={() => setInput("Suggest a beginner fat-loss routine.")} className="bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/40 hover:border-cyan-500/30 p-3 rounded-xl cursor-pointer transition">
                • Suggest a beginner fat-loss routine.
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}