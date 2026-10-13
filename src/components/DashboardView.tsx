"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  UserCheck,
  Wrench,
  Download,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import { MasterResume, TailoredResult, HistoryEntry } from "@/types/resume";

interface DashboardViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  history: HistoryEntry[];
  onNavigate: (tab: "profile" | "tailor" | "diff" | "skills" | "export" | "history") => void;
  onLoadSample: () => void;
}

export default function DashboardView({
  resume,
  result,
  history,
  onNavigate,
  onLoadSample,
}: DashboardViewProps) {
  const scores = history.map((h) => h.score_after || h.score_before).filter(Boolean);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950 p-8 sm:p-10 border border-indigo-500/20 shadow-2xl shadow-indigo-950/50">
        {/* Glow ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered ATS Precision Tailoring • 100% Free</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Tailor Your Resume For{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Any Job Description.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
            Beat the Applicant Tracking System without fabricating false experience. ResumeForge aligns your genuine accomplishments, measures keyword density, and builds custom projects for missing skills.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("tailor")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Target className="w-4 h-4" />
              Tailor Resume Now
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLoadSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-indigo-500/20 transition-all hover:scale-105"
            >
              Load Sample Profile
            </button>
          </div>

          {/* Key badges */}
          <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-indigo-500/10">
            {[
              "🔒 Zero Fabrication Guarantee",
              "⚡ Llama 3.3 70B & Groq Speed",
              "🎯 Dual-Axis ATS Scorer",
              "🛠️ Weekend Skill Builder",
              "📄 Word DOCX & PDF Exports",
            ].map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-medium text-slate-400"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Candidate</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white truncate">{resume.contact.name || "No Profile"}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">{resume.contact.email || "Add in Profile"}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg ATS Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{avgScore || "--"}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all tailored runs</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peak Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{bestScore || "--"}</div>
          <div className="text-[11px] text-slate-400 mt-1">Highest target compatibility</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Runs</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{history.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Applications tracked</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Latest Score Card or Empty state */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Latest ATS Evaluation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time compatibility rating based on your last target job.
            </p>
          </div>

          <div className="my-6">
            <ScoreGauge
              score={result?.score_after?.overall_score ?? (scores[scores.length - 1] || 0)}
              label={result ? "Tailored Match" : "Baseline Match"}
            />
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            {result ? (
              <button
                onClick={() => onNavigate("diff")}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 transition-all"
              >
                Inspect Bullet Diff & Changes
              </button>
            ) : (
              <button
                onClick={() => onNavigate("tailor")}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                Analyze a Job Description
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate("profile")}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-indigo-950/20 border border-indigo-500/15 hover:border-indigo-500/40 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              Manage Master Profile
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Maintain your genuine source-of-truth resume. Add past projects, tech skills, and career milestones.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
              Open Profile Editor <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate("tailor")}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/20 border border-purple-500/15 hover:border-purple-500/40 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Tailor For Target Role
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Paste any job description to trigger the Groq AI optimization pipeline and boost ATS match percentage.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
              Launch Tailor Engine <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate("skills")}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/20 border border-amber-500/15 hover:border-amber-500/40 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Weekend Skill Builder
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Missing a critical tool like Kubernetes or Kafka? Generate practical weekend project ideas to build it.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              Explore Projects <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate("export")}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-emerald-950/20 border border-emerald-500/15 hover:border-emerald-500/40 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              ATS-Safe Export Hub
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Download clean single-column PDF, ATS-friendly Word DOCX, personalized cover letter, and LinkedIn headline.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              Download Files <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
