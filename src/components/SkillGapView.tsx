"use client";

import { useState } from "react";
import { Wrench, Clock, Layers, CheckCircle2, Copy, ArrowRight, Sparkles } from "lucide-react";
import { TailoredResult } from "@/types/resume";

interface SkillGapViewProps {
  result: TailoredResult | null;
  onNavigate: (tab: "tailor" | "export") => void;
}

export default function SkillGapView({ result, onNavigate }: SkillGapViewProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const projects = result?.skill_gap_projects || [];

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  if (!projects.length) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 animate-fadeIn">
        <Wrench className="w-16 h-16 text-slate-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Skill Gap Projects Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Run the Tailoring pipeline on a target job description to identify skills your resume is missing and generate weekend project ideas.
        </p>
        <button
          onClick={() => onNavigate("tailor")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Analyze a Job Description
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Missing a skill? Build it in a weekend.
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            Skill Gap Project Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Genuine acquisition beats fake resumes. These hands-on weekend projects bridge resume gaps and prove competency.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
          {projects.length} Practical Projects
        </span>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900/50 border border-amber-500/20 hover:border-amber-500/40 backdrop-blur-xl transition-all space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 mb-2">
                  Missing Skill: {proj.missing_skill}
                </span>
                <h3 className="text-xl font-bold text-white">{proj.project_title}</h3>
                <p className="text-xs text-slate-400 mt-1">{proj.tagline}</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-semibold self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {proj.estimated_time}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {proj.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Implementation Steps */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Implementation Roadmap
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {proj.key_steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                      Phase {sIdx + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Bullet to Add */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resume Bullet To Add After Completion
                </span>
                <button
                  onClick={() => handleCopyBullet(proj.resume_bullet_sample, idx)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
                >
                  <Copy className="w-3 h-3" />
                  {copiedIdx === idx ? "Copied!" : "Copy Bullet"}
                </button>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed font-mono">
                &ldquo;{proj.resume_bullet_sample}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
