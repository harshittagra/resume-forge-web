"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  RotateCcw,
  Zap,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Briefcase,
  Trophy,
  Upload,
} from "lucide-react";
import ATSBreakdownCard from "./ATSBreakdownCard";
import ResumeDropzone from "./ResumeDropzone";
import { MasterResume, ScanResult } from "@/types/resume";

interface ScanViewProps {
  resume: MasterResume;
  onNavigate: (tab: "tailor" | "interview") => void;
  customApiKey?: string;
  onScanComplete?: (scanResult: ScanResult) => void;
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

export default function ScanView({
  resume,
  onNavigate,
  customApiKey,
  onScanComplete,
  onResumeUpdate,
}: ScanViewProps) {
  const [activeResume, setActiveResume] = useState<MasterResume>(resume);
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleResumeUploaded = (newResume: MasterResume, filename: string) => {
    setActiveResume(newResume);
    onResumeUpdate?.(newResume);
  };

  const handleScan = async () => {
    if (!jdText.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: activeResume,
          jobDescription: jdText,
          customApiKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scan failed");
      }

      const data: ScanResult = await res.json();
      setScanResult(data);
      onScanComplete?.(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case "strong":
        return {
          icon: Trophy,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/25",
          label: "Strong Fit",
        };
      case "moderate":
        return {
          icon: AlertTriangle,
          color: "text-amber-400",
          bg: "bg-amber-500/10 border-amber-500/25",
          label: "Moderate Fit",
        };
      default:
        return {
          icon: XCircle,
          color: "text-rose-400",
          bg: "bg-rose-500/10 border-rose-500/25",
          label: "Needs Work",
        };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tailor your resume for{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            every job
          </span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Upload your resume, paste the job description — get an ATS-friendly in-depth scan in seconds.
        </p>
      </div>

      {/* Input Section - 2 Columns */}
      {!scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Upload Resume */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" /> Upload Resume
                </span>
                <span className="text-[11px] text-slate-400 font-mono">PDF, DOCX, TXT</span>
              </div>

              <div className="my-auto py-2">
                <ResumeDropzone
                  currentResume={activeResume}
                  onResumeLoaded={handleResumeUploaded}
                  customApiKey={customApiKey}
                />
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Your resume is parsed locally in real-time. Zero data is shared.
              </p>
            </div>

            {/* Column 2: Job Description */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/15 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-400" /> Job Description
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
                rows={9}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description, requirements, and responsibilities here..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed font-mono resize-none transition-colors"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{jdText.length} characters</span>
                <span>Role: {jdText.slice(0, 30).trim() || "Untitled"}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-2xl transition-all ${
              loading
                ? "bg-purple-700 text-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Deep ATS Scan & Keyword Analysis...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Scan for ATS Match</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Header Banner with Verdict */}
          {(() => {
            const vConfig = getVerdictConfig(scanResult.readiness_verdict);
            const VIcon = vConfig.icon;
            return (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{scanResult.seniority} Level</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {scanResult.job_title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{scanResult.company}</span>
                  </div>
                </div>

                <div
                  className={`px-4 py-2.5 rounded-2xl border ${vConfig.bg} flex items-center gap-2.5 shrink-0`}
                >
                  <VIcon className={`w-5 h-5 ${vConfig.color}`} />
                  <div>
                    <div className={`text-xs font-black uppercase ${vConfig.color}`}>
                      {vConfig.label}
                    </div>
                    <div className="text-[11px] text-slate-400 max-w-[200px]">
                      {scanResult.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Breakdown Card */}
          <ATSBreakdownCard
            score={scanResult.score}
            keywordHeatmap={scanResult.keyword_heatmap}
          />

          {/* Decision Actions Bar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate("tailor")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4" />
              Tailor Resume for This Role
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("interview")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-indigo-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Prep Interview Questions
            </button>

            <button
              onClick={() => setScanResult(null)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
