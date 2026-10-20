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
} from "lucide-react";
import ATSBreakdownCard from "./ATSBreakdownCard";
import { MasterResume, ScanResult } from "@/types/resume";

interface ScanViewProps {
  resume: MasterResume;
  onNavigate: (tab: "tailor" | "interview") => void;
  customApiKey?: string;
  onScanComplete?: (scanResult: ScanResult) => void;
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
}: ScanViewProps) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

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
          masterResume: resume,
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
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-purple-400" />
          Quick ATS Scan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Scan any job description to see your ATS compatibility score, keyword gaps, and format compliance — <strong>before</strong> deciding to tailor.
        </p>
      </div>

      {/* Input Section */}
      {!scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Paste Job Description
            </label>
            <button
              onClick={() => setJdText(SAMPLE_JD)}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Load Sample JD
            </button>
          </div>

          <textarea
            rows={12}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste any job posting — title, requirements, responsibilities, qualifications..."
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed font-mono resize-y transition-colors"
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
              loading
                ? "bg-purple-700 text-slate-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing ATS compatibility...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan for ATS Match</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Results */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Job Info + Verdict */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="uppercase font-bold tracking-wider">{scanResult.seniority} Level</span>
                </div>
                <h3 className="text-xl font-bold text-white">{scanResult.job_title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  {scanResult.company}
                </div>
              </div>

              {/* Verdict Badge */}
              {(() => {
                const vc = getVerdictConfig(scanResult.readiness_verdict);
                const Icon = vc.icon;
                return (
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${vc.bg}`}>
                    <Icon className={`w-5 h-5 ${vc.color}`} />
                    <div>
                      <div className={`text-sm font-bold ${vc.color}`}>{vc.label}</div>
                      <div className="text-[11px] text-slate-400 max-w-xs">{scanResult.recommendation}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Full ATS Breakdown */}
          <ATSBreakdownCard score={scanResult.score} keywordHeatmap={scanResult.keyword_heatmap} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate("tailor")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Tailor Resume for This Role
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("interview")}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Prep Interview Questions
            </button>

            <button
              onClick={() => {
                setScanResult(null);
                setJdText("");
              }}
              className="py-3.5 px-6 rounded-2xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Another
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
