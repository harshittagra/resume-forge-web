"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Download,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { MasterResume, TailoredResult } from "@/types/resume";

interface CoverLetterViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  onNavigate: (tab: "tailor" | "export") => void;
  customApiKey?: string;
}

export default function CoverLetterView({
  resume,
  result,
  onNavigate,
  customApiKey,
}: CoverLetterViewProps) {
  const [copyState, setCopyState] = useState(false);
  const [editedLetter, setEditedLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [standaloneLetter, setStandaloneLetter] = useState<string | null>(null);
  const [standaloneJd, setStandaloneJd] = useState("");
  const [error, setError] = useState<string | null>(null);

  const letter = editedLetter ?? result?.cover_letter ?? standaloneLetter ?? null;

  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter);
      setCopyState(true);
      setTimeout(() => setCopyState(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      if (data.cover_letter) {
        setStandaloneLetter(data.cover_letter);
        setEditedLetter(null);
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
          <FileText className="w-6 h-6 text-amber-400" />
          Cover Letter Generator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Generate, edit, and export personalized cover letters grounded 100% in your actual experience. Zero fabrication.
        </p>
      </div>

      {letter ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-indigo-500/15">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">AI-Generated Cover Letter</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ready
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-all"
              >
                {copyState ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copyState ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                .txt
              </button>
            </div>
          </div>

          {/* Editable Letter */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl">
            <textarea
              rows={16}
              value={editedLetter ?? letter}
              onChange={(e) => setEditedLetter(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed resize-y font-sans"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              ✏️ You can edit the letter above. Changes are preserved until you navigate away.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate("export")}
              className="flex-1 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              Go to Export Hub
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditedLetter(null);
                setStandaloneLetter(null);
              }}
              className="py-3 px-6 rounded-2xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            >
              Generate New
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Option 1: Use existing tailoring result */}
          {!result?.cover_letter && (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
                Generate from Job Description
              </h3>
              <p className="text-xs text-slate-400">
                Paste a job description and we&apos;ll generate a tailored cover letter from your resume.
              </p>

              <textarea
                rows={8}
                value={standaloneJd}
                onChange={(e) => setStandaloneJd(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed font-mono resize-y"
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
                    ? "bg-purple-700 text-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating cover letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Option 2: Redirect to Tailor */}
          <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-800 backdrop-blur-xl text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Or run the full <strong>Tailor & Score</strong> pipeline first — it generates a cover letter alongside tailored bullets, ATS scoring, and more.
            </p>
            <button
              onClick={() => onNavigate("tailor")}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 transition-all"
            >
              Go to Tailor & Score →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
