"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { MasterResume } from "@/types/resume";

interface ResumeDropzoneProps {
  currentResume: MasterResume;
  onResumeLoaded: (resume: MasterResume, filename: string) => void;
  customApiKey?: string;
  compact?: boolean;
}

export default function ResumeDropzone({
  currentResume,
  onResumeLoaded,
  customApiKey,
  compact = false,
}: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const validExtensions = ["pdf", "docx", "txt", "md"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setError("Please upload a PDF, DOCX, or TXT resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum allowed size (5MB).");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (customApiKey) {
        formData.append("customApiKey", customApiKey);
      }

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse resume.");
      }

      setUploadedFilename(file.name);
      onResumeLoaded(data.parsedResume, file.name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const hasName = Boolean(currentResume?.contact?.name);
  const expCount = currentResume?.experience?.length || 0;
  const skillsCount =
    (currentResume?.skills?.languages?.length || 0) +
    (currentResume?.skills?.frameworks?.length || 0) +
    (currentResume?.skills?.tools_and_platforms?.length || 0);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-indigo-950/20 border-2 border-dashed border-indigo-500/40 text-center animate-pulse">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
          <p className="text-sm font-semibold text-white">Extracting Resume & ATS Skills...</p>
          <p className="text-xs text-slate-400 mt-1">Reading PDF/DOCX structure & normalizing content</p>
        </div>
      ) : uploadedFilename || hasName ? (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white truncate">
                  {uploadedFilename || `${currentResume.contact.name || "Resume"}.pdf`}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {currentResume.contact.name ? `Candidate: ${currentResume.contact.name}` : ""}
                {expCount > 0 ? ` • ${expCount} experiences` : ""}
                {skillsCount > 0 ? ` • ${skillsCount} skills` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? "bg-indigo-600/15 border-indigo-400 scale-[1.01]"
              : "bg-slate-900/40 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-900/70"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">Drop your PDF or DOCX here</p>
          <p className="text-xs text-slate-400 mt-1">or click to browse from your computer</p>
          <span className="mt-3 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 uppercase bg-slate-800/80">
            MAX SIZE 5MB • PDF, DOCX, TXT
          </span>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
