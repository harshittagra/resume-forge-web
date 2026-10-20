"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Briefcase,
  Code,
  Users,
  Lightbulb,
  Server,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { MasterResume, InterviewPrepResult, InterviewQuestion } from "@/types/resume";

interface InterviewPrepViewProps {
  resume: MasterResume;
  customApiKey?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof Code; color: string; bg: string; label: string }> = {
  technical: { icon: Code, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", label: "Technical" },
  behavioral: { icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Behavioral" },
  situational: { icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Situational" },
  "system-design": { icon: Server, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", label: "System Design" },
};

export default function InterviewPrepView({
  resume,
  customApiKey,
}: InterviewPrepViewProps) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prepResult, setPrepResult] = useState<InterviewPrepResult | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleGenerate = async () => {
    if (!jdText.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: resume,
          jobDescription: jdText,
          customApiKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data: InterviewPrepResult = await res.json();
      setPrepResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = prepResult?.questions?.filter(
    (q) => activeFilter === "all" || q.category === activeFilter
  ) || [];

  const categoryCounts = prepResult?.questions?.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          Interview Prep Assistant
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          AI-generated interview questions with STAR-method answer frameworks based on YOUR real experience. No fabrication.
        </p>
      </div>

      {!prepResult ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Paste Target Job Description
            </label>
          </div>

          <textarea
            rows={10}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job posting you're preparing to interview for..."
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed font-mono resize-y"
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
              loading
                ? "bg-emerald-700 text-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating likely interview questions...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Generate Interview Questions</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Job Info */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm font-bold text-white">{prepResult.role_title}</div>
                <div className="text-[11px] text-slate-400">{prepResult.company} • {prepResult.questions.length} questions generated</div>
              </div>
            </div>
            <button
              onClick={() => {
                setPrepResult(null);
                setJdText("");
                setExpandedIdx(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Prep
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({prepResult.questions.length})
            </button>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.technical;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeFilter === cat
                      ? "bg-indigo-600 text-white"
                      : `bg-slate-800 ${config.color} hover:bg-slate-700`
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((q: InterviewQuestion, idx: number) => {
              const config = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG.technical;
              const Icon = config.icon;
              const isExpanded = expandedIdx === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-2xl border transition-all ${config.bg}`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-start gap-3 text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{q.why_likely}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  {/* Expanded Answer Framework */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3 border-t border-slate-800/50 pt-3">
                          {/* STAR Framework */}
                          {q.star_framework && (
                            <div className="space-y-2">
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-amber-400" />
                                STAR Method Answer Framework
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                  { key: "situation", label: "S — Situation", color: "border-l-indigo-500" },
                                  { key: "task", label: "T — Task", color: "border-l-purple-500" },
                                  { key: "action", label: "A — Action", color: "border-l-emerald-500" },
                                  { key: "result", label: "R — Result", color: "border-l-amber-500" },
                                ].map(({ key, label, color }) => (
                                  <div key={key} className={`p-3 rounded-xl bg-slate-950/60 border border-slate-800 border-l-2 ${color}`}>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                      {q.star_framework?.[key as keyof typeof q.star_framework]}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tips */}
                          {q.tips && q.tips.length > 0 && (
                            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Pro Tips
                              </div>
                              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                                {q.tips.map((tip, tIdx) => (
                                  <li key={tIdx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
