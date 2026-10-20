"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { ATSMatchScore, SectionScore, FormatCheck, KeywordHeatmapItem } from "@/types/resume";
import ScoreGauge from "./ScoreGauge";

interface ATSBreakdownCardProps {
  score: ATSMatchScore;
  keywordHeatmap?: KeywordHeatmapItem[];
}

export default function ATSBreakdownCard({ score, keywordHeatmap }: ATSBreakdownCardProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overall Score + Sub-scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex justify-center">
          <ScoreGauge score={score.overall_score} size={180} label="ATS Match Score" />
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Keyword Density</div>
            <div className="text-2xl font-extrabold text-white">{score.keyword_score}%</div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${score.keyword_score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Semantic Alignment</div>
            <div className="text-2xl font-extrabold text-white">{score.semantic_score}%</div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${score.semantic_score}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 col-span-2">
            <div className="text-xs text-slate-300 leading-relaxed">{score.summary}</div>
          </div>
        </div>
      </div>

      {/* Per-Section Breakdown */}
      {score.section_scores && score.section_scores.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Per-Section Breakdown
          </h3>
          <div className="space-y-3">
            {score.section_scores.map((section: SectionScore, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{section.label}</span>
                  <span className={`font-bold ${
                    section.score >= 70 ? "text-emerald-400" : section.score >= 40 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {section.score}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      section.score >= 70
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : section.score >= 40
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-rose-500 to-rose-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${section.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{section.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Heatmap */}
      {keywordHeatmap && keywordHeatmap.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Keyword Heatmap
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {keywordHeatmap.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs border ${
                  item.found
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.found ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  )}
                  <span className={item.found ? "text-emerald-300 font-semibold" : "text-rose-300 font-semibold"}>
                    {item.keyword}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.where_found && (
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{item.where_found}</span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    item.importance === "critical"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : item.importance === "important"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}>
                    {item.importance}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Format Compliance Checks */}
      {score.format_checks && score.format_checks.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Resume Format Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {score.format_checks.map((check: FormatCheck, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                  check.passed
                    ? "bg-emerald-500/5 border-emerald-500/15"
                    : check.severity === "critical"
                    ? "bg-rose-500/5 border-rose-500/15"
                    : "bg-amber-500/5 border-amber-500/15"
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : check.severity === "critical" ? (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : check.severity === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-200">{check.rule}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{check.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Matched & Missing Keyword Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-emerald-500/15 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matched Keywords ({score.matched_keywords.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {score.matched_keywords.map((kw) => (
              <span key={kw} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {score.missing_keywords.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-rose-500/15 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Missing Keywords ({score.missing_keywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {score.missing_keywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 border border-rose-500/25 text-rose-300">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
