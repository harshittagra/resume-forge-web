"use client";

import { useState } from "react";
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
  Upload,
  Briefcase,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Globe,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import ResumeDropzone from "./ResumeDropzone";
import ATSBreakdownCard from "./ATSBreakdownCard";
import { MasterResume, TailoredResult, HistoryEntry, ScanResult } from "@/types/resume";
import { NavTab } from "./Navbar";

interface DashboardViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  history: HistoryEntry[];
  onNavigate: (tab: NavTab) => void;
  onLoadSample: () => void;
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
• Deep commitment to test-driven engineering, CI/CD automation, and API security.`;

export default function DashboardView({
  resume,
  result,
  history,
  onNavigate,
  onLoadSample,
  customApiKey,
  onResumeUpdate,
}: DashboardViewProps) {
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [dashboardScan, setDashboardScan] = useState<ScanResult | null>(null);

  const scores = history.map((h) => h.score_after || h.score_before).filter(Boolean);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  const handleRunScan = async () => {
    if (!jdText.trim()) {
      setScanError("Please paste a target job description first.");
      return;
    }

    setScanLoading(true);
    setScanError(null);

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
      setDashboardScan(data);
    } catch (err: unknown) {
      setScanError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Banner with FIFA-like ambient glow */}
      <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12 border border-indigo-500/20 shadow-2xl shadow-indigo-950/60">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Powered ATS Precision Tailoring • 100% Free & Open Source</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] font-display">
            Scan Your Resume.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Beat the ATS.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            Upload your resume, paste any job description, and get instant ATS compatibility scoring, keyword gap analysis, and honest tailoring with zero hallucination.
          </p>

          {/* Key Badges */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-indigo-500/15">
            {[
              "🔒 Zero Fabrication Guarantee",
              "⚡ Llama 3.3 70B & Groq Speed",
              "🎯 Dual-Axis ATS Scorer",
              "📄 PDF & DOCX Drag-and-Drop",
              "✨ STAR Interview Generator",
            ].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CORE UPLOAD & SCAN STUDIO (Right on the main dashboard!) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5 font-display">
              <Upload className="w-6 h-6 text-indigo-400" />
              Upload Resume & Check ATS Compatibility
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Drop your PDF or DOCX resume below to immediately calculate your keyword density, formatting compliance, and role fit.
            </p>
          </div>

          <button
            type="button"
            onClick={onLoadSample}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Load Sample Profile
          </button>
        </div>

        {/* Dual-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Upload Resume */}
          <div className="p-6 rounded-3xl glass-strong border border-indigo-500/20 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" /> 1. Upload Resume
              </span>
              <span className="text-[11px] text-slate-400 font-mono">PDF, DOCX, TXT</span>
            </div>

            <div className="my-auto py-2">
              <ResumeDropzone
                currentResume={resume}
                onResumeLoaded={(newResume) => onResumeUpdate?.(newResume)}
                customApiKey={customApiKey}
              />
            </div>

            <div className="text-[11px] text-slate-500 text-center">
              Parsed locally in real-time. Zero data is shared or stored.
            </div>
          </div>

          {/* Card 2: Target Job Description */}
          <div className="p-6 rounded-3xl glass-strong border border-indigo-500/20 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" /> 2. Target Job Description
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
              rows={8}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the target job description, requirements, responsibilities..."
              className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed font-mono resize-none transition-colors"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{jdText.length} characters</span>
              <span>Target: {jdText.slice(0, 30).trim() || "Untitled"}</span>
            </div>
          </div>
        </div>

        {scanError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{scanError}</span>
          </div>
        )}

        <button
          onClick={handleRunScan}
          disabled={scanLoading}
          className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-2xl transition-all ${
            scanLoading
              ? "bg-purple-700 text-slate-300 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] glow-indigo"
          }`}
        >
          {scanLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing ATS Keywords, Compatibility & Format...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Check ATS Score & Keyword Match</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Real-Time Scan Results on Dashboard if generated */}
      {dashboardScan && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4 border-t border-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ATS Evaluation Results
            </h3>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
              {dashboardScan.readiness_verdict} Fit
            </span>
          </div>

          <ATSBreakdownCard
            score={dashboardScan.score}
            keywordHeatmap={dashboardScan.keyword_heatmap}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("tailor")}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Tailor Resume Bullet Points
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("interview")}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Prep Interview Questions
            </button>

            <button
              onClick={() => onNavigate("export")}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export ATS-Safe PDF / Word
            </button>
          </div>
        </motion.div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Candidate</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">{resume.contact.name || "Alex Morgan"}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">{resume.contact.email || "Loaded in Profile"}</div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg ATS Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-display">{avgScore || "85"}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all tailored runs</div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peak Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-display">{bestScore || "92"}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Highest target compatibility</div>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">{Math.max(history.length, 1)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Applications tracked</div>
        </div>
      </div>

      {/* Feature Navigation Cards Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigate("tailor")}
          className="p-6 rounded-2xl glass-card cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 font-display transition-colors">
            One-Click Tailoring
          </h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Re-align genuine achievements to mirror target job keywords with zero fabrication.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigate("interview")}
          className="p-6 rounded-2xl glass-card cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-purple-300 font-display transition-colors">
            STAR Interview Prep
          </h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Technical, behavioral, and situational interview questions grounded in your resume.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigate("coverletter")}
          className="p-6 rounded-2xl glass-card cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 font-display transition-colors">
            Cover Letter Studio
          </h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Generate customized, professional cover letters with real-time inline editing.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => onNavigate("linkedin")}
          className="p-6 rounded-2xl glass-card cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-emerald-300 font-display transition-colors">
            LinkedIn Optimizer
          </h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Search-optimized headline, About section, and skill tags for recruiter visibility.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
