"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  RotateCcw,
  Zap,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import ResumeDropzone from "./ResumeDropzone";
import { MasterResume, TailoredResult } from "@/types/resume";

interface TailorViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  onTailored: (result: TailoredResult) => void;
  onNavigate: (tab: "diff" | "skills" | "export") => void;
  customApiKey?: string;
  onResumeUpdate?: (resume: MasterResume) => void;
}

const SAMPLE_JD = `Senior Full-Stack & AI Systems Engineer
Company: Anthropic Cloud Solutions
Location: San Francisco, CA / Remote

About the Role:
We are seeking a Senior Full-Stack & AI Systems Engineer to build mission-critical enterprise AI interfaces and distributed retrieval pipelines. You will collaborate with researchers to deploy low-latency generative models into high-traffic production environments.

Requirements & Qualifications:
• 4+ years building production web applications with Next.js, React, TypeScript, and modern state management.
• Hands-on expertise building RAG (Retrieval-Augmented Generation) pipelines, vector search, and LLM orchestration (LangChain / LlamaIndex / Groq).
• Experience with containerization, Docker, and Kubernetes orchestration in cloud environments (AWS / GCP).
• Strong database proficiency with PostgreSQL, Redis caching, and high-throughput messaging (Kafka).
• Deep commitment to test-driven engineering, CI/CD automation, and API security.

Nice to Have:
• Experience with PyTorch, distributed inference, and fine-tuning.
• Prior experience at high-growth AI startups.`;

export default function TailorView({
  resume,
  result,
  onTailored,
  onNavigate,
  customApiKey,
  onResumeUpdate,
}: TailorViewProps) {
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("");

  const handleRunTailor = async () => {
    if (!jdText.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep("Analyzing job description & ATS keywords...");

    try {
      const res = await fetch("/api/tailor", {
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
        throw new Error(data.error || "Tailoring failed");
      }

      const data: TailoredResult = await res.json();
      onTailored(data);

      // Trigger celebratory confetti if score improved!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Tailoring failed");
    } finally {
      setLoading(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-400" />
          Target Job Description & ATS Scorer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Paste the job description you want to apply for. Our AI checks ATS keyword overlap, calculates match scores, and tailors your resume.
        </p>
      </div>

      {/* Main Grid: JD Input on Left, Score and Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Description Textarea */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> 1. Upload or Active Resume
                </label>
                <span className="text-[11px] text-slate-400 font-mono">PDF, DOCX, TXT</span>
              </div>
              <ResumeDropzone
                currentResume={resume}
                onResumeLoaded={(res) => onResumeUpdate?.(res)}
                customApiKey={customApiKey}
                compact
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" /> 2. Target Job Description
                </label>
                <button
                  type="button"
                  onClick={() => setJdText(SAMPLE_JD)}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Load Sample JD
                </button>
              </div>

              <textarea
                rows={10}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste job title, requirements, responsibilities, and qualifications..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed font-mono resize-y"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleRunTailor}
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                loading
                  ? "bg-indigo-700 text-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{currentStep || "Processing..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Run One-Click Tailoring Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Score & Tag Analysis */}
        <div className="lg:col-span-5 space-y-6">
          {/* Score Gauges Card */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              ATS Match Analysis
            </h3>

            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 items-center justify-center">
                  <div className="text-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                    <ScoreGauge score={result.score_before.overall_score} size={120} label="Before" />
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-purple-950/20 border border-indigo-500/30">
                    <ScoreGauge score={result.score_after.overall_score} size={120} label="Tailored" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 text-center font-medium">
                  {result.score_after.summary}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400">Keyword Density</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {result.score_after.keyword_score}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400">Semantic Alignment</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {result.score_after.semantic_score}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onNavigate("diff")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    View Diff <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate("export")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center"
                  >
                    Export Docs
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Target className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs max-w-xs mx-auto">
                  Click <strong>Run One-Click Tailoring</strong> to compute your ATS score and generate tailored bullets.
                </p>
              </div>
            )}
          </div>

          {/* Keyword Tag Clouds (if result available) */}
          {result && (
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-indigo-500/15 backdrop-blur-xl space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                  ✓ Matched Keywords ({result.score_after.matched_keywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.score_after.matched_keywords.slice(0, 16).map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {result.score_after.missing_keywords.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-2">
                    ⚠ Missing Keywords ({result.score_after.missing_keywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.score_after.missing_keywords.slice(0, 12).map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 border border-rose-500/25 text-rose-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
