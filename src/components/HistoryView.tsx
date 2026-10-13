"use client";

import { History, Trash2, ArrowRight, TrendingUp, Award, Clock } from "lucide-react";
import { HistoryEntry, TailoredResult } from "@/types/resume";

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelectHistory: (item: TailoredResult) => void;
  onClearHistory: () => void;
  onNavigate: (tab: "tailor") => void;
}

export default function HistoryView({
  history,
  onSelectHistory,
  onClearHistory,
  onNavigate,
}: HistoryViewProps) {
  const scores = history.map((h) => h.score_after || h.score_before).filter(Boolean);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  if (!history.length) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 animate-fadeIn">
        <History className="w-16 h-16 text-slate-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Application History</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Every time you tailor your resume for a job description, your ATS scores and changes will be logged here.
        </p>
        <button
          onClick={() => onNavigate("tailor")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Run First Tailoring
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Tailoring & Application History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track scores, gaps, and tailored documents across every role you have optimized for.
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase">Total Applications</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{history.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase">Average ATS Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{avgScore}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase">Best Match Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{bestScore}</div>
        </div>
      </div>

      {/* All Runs List */}
      <div className="space-y-3">
        {history.map((item) => {
          const score = item.score_after || item.score_before || 0;
          const scoreColor =
            score >= 75
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : score >= 50
              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
              : "bg-rose-500/15 text-rose-400 border-rose-500/30";

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item.result)}
              className="p-5 rounded-2xl bg-slate-900/40 border border-indigo-500/10 hover:border-indigo-500/30 backdrop-blur-md flex items-center justify-between gap-4 cursor-pointer transition-all hover:translate-x-1"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center font-extrabold text-base ${scoreColor}`}
                >
                  {score}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.role_title || "Target Role"}
                    <span className="text-xs font-normal text-slate-400">@ {item.company || "Target Company"}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(item.timestamp).toLocaleString()} • {item.gaps_count} Gaps Identified • {item.changes_count} Bullets Tailored
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>View Results</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
