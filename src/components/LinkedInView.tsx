"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Wand2,
  AlertCircle,
  User,
  Hash,
} from "lucide-react";
import { MasterResume, TailoredResult } from "@/types/resume";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

interface LinkedInViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  onNavigate: (tab: "tailor") => void;
  customApiKey?: string;
}

export default function LinkedInView({
  resume,
  result,
  onNavigate,
  customApiKey,
}: LinkedInViewProps) {
  const [copyState, setCopyState] = useState<string | null>(null);
  const [standaloneJd, setStandaloneJd] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [standaloneLinkedin, setStandaloneLinkedin] = useState<{ headline: string; about: string } | null>(null);

  const linkedin = standaloneLinkedin ?? result?.linkedin ?? null;
  const hasContent = linkedin && (linkedin.headline || linkedin.about);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(id);
    setTimeout(() => setCopyState(null), 2500);
  };

  const handleGenerateStandalone = async () => {
    if (!standaloneJd.trim()) {
      setError("Please paste a job description first.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterResume: resume,
          jobDescription: standaloneJd,
          customApiKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data: TailoredResult = await res.json();
      if (data.linkedin) {
        setStandaloneLinkedin(data.linkedin);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-sky-400" />
          LinkedIn Optimizer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Generate a search-optimized LinkedIn headline and About section tailored to your target role.
        </p>
      </div>

      {hasContent ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Headline Card */}
          {linkedin.headline && (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-sky-500/15 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-white">Optimized Headline</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {linkedin.headline.length}/220 chars
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(linkedin.headline, "headline")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all"
                >
                  {copyState === "headline" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copyState === "headline" ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-indigo-950/30 border border-sky-500/20">
                <p className="text-sm text-white font-semibold leading-relaxed">{linkedin.headline}</p>
              </div>

              {/* Character count bar */}
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-sky-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (linkedin.headline.length / 220) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* About Section Card */}
          {linkedin.about && (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-sky-500/15 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-white">About Section</span>
                </div>
                <button
                  onClick={() => handleCopy(linkedin.about, "about")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all"
                >
                  {copyState === "about" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copyState === "about" ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{linkedin.about}</p>
              </div>
            </div>
          )}

          {/* LinkedIn Tips */}
          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              LinkedIn Search Optimization Tips
            </h4>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Your headline appears in LinkedIn search — include your target role and key skills</li>
              <li>Use industry-specific keywords naturally throughout your About section</li>
              <li>Keep your About section under 2,600 characters for best mobile readability</li>
              <li>Start with a compelling first line — it shows as a preview in search results</li>
            </ul>
          </div>

          {/* Reset */}
          <button
            onClick={() => setStandaloneLinkedin(null)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            Generate for Another Role
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Generator */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-sky-400" />
              Generate LinkedIn Content
            </h3>
            <p className="text-xs text-slate-400">
              Paste a target job description and we&apos;ll generate an optimized LinkedIn headline and About section.
            </p>

            <textarea
              rows={8}
              value={standaloneJd}
              onChange={(e) => setStandaloneJd(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-sky-500 focus:outline-none leading-relaxed font-mono resize-y"
            />

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateStandalone}
              disabled={isGenerating}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${
                isGenerating
                  ? "bg-sky-700 text-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-600/30 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing LinkedIn content...</span>
                </>
              ) : (
                <>
                  <LinkedInIcon className="w-4 h-4" />
                  <span>Generate LinkedIn Content</span>
                </>
              )}
            </button>
          </div>

          {/* Redirect */}
          <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800 backdrop-blur-xl text-center space-y-3">
            <Globe className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The <strong>Tailor & Score</strong> pipeline also generates LinkedIn content alongside everything else.
            </p>
            <button
              onClick={() => onNavigate("tailor")}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 transition-all"
            >
              Go to Tailor & Score <ArrowRight className="w-3 h-3 inline ml-1" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
