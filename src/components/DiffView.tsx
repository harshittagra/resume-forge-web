"use client";

import { GitCompare, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { TailoredResult } from "@/types/resume";

interface DiffViewProps {
  result: TailoredResult | null;
  onNavigate: (tab: "tailor" | "skills" | "export") => void;
}

export default function DiffView({ result, onNavigate }: DiffViewProps) {
  if (!result || !result.diffs.length) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 animate-fadeIn">
        <GitCompare className="w-16 h-16 text-slate-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Tailoring Diffs Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Run the tailoring engine on a target job description to generate an interactive side-by-side diff.
        </p>
        <button
          onClick={() => onNavigate("tailor")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Go To Tailor Engine
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
            <GitCompare className="w-6 h-6 text-indigo-400" />
            Resume Bullet Diff Viewer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare original experience bullets against tailored versions with explicit ATS rationale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Zero Fabrication
          </span>
        </div>
      </div>

      {/* Summary Diff (if modified) */}
      {result.tailored_resume.summary && (
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
            Professional Summary Enhancement
          </span>
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed font-normal">
            {result.tailored_resume.summary}
          </div>
        </div>
      )}

      {/* Experience Roles Diffs */}
      <div className="space-y-6">
        {result.diffs.map((diffRole, rIdx) => (
          <div
            key={rIdx}
            className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{diffRole.role}</h3>
                <p className="text-xs text-indigo-300 font-medium">{diffRole.company}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {diffRole.bullet_diffs.length} Bullets Tailored
              </span>
            </div>

            <div className="space-y-4">
              {diffRole.bullet_diffs.map((bDiff, bIdx) => (
                <div
                  key={bIdx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Before */}
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border-l-4 border-rose-500 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                        Original Bullet
                      </span>
                      <p className="text-xs text-rose-200 leading-relaxed">{bDiff.original}</p>
                    </div>

                    {/* After */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border-l-4 border-emerald-500 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                        Tailored for ATS
                      </span>
                      <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                        {bDiff.tailored}
                      </p>
                    </div>
                  </div>

                  {/* Rationale and Keywords */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-slate-400 font-medium">Rationale:</span>
                      <span className="text-indigo-200">{bDiff.rationale}</span>
                    </div>

                    {bDiff.matched_keywords?.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {bDiff.matched_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            +{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => onNavigate("skills")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
        >
          Check Missing Skills
        </button>
        <button
          onClick={() => onNavigate("export")}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
        >
          Export Tailored Resume <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
