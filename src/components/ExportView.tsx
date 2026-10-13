"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  Globe,
  FileCode,
  Sparkles,
} from "lucide-react";
import { TailoredResult, MasterResume } from "@/types/resume";
import { generateDocxResume } from "@/lib/docxExport";

interface ExportViewProps {
  resume: MasterResume;
  result: TailoredResult | null;
  onNavigate: (tab: "tailor") => void;
}

export default function ExportView({ resume, result, onNavigate }: ExportViewProps) {
  const [copyState, setCopyState] = useState<string | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const activeResume = result?.tailored_resume || resume;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(id);
    setTimeout(() => setCopyState(null), 2500);
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateDocxResume(activeResume);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name = (activeResume.contact.name || "resume").toLowerCase().replace(/\s+/g, "_");
      a.href = url;
      a.download = `${name}_ats_resume.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX generation error:", err);
      alert("Failed to generate DOCX file.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activeResume, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tailored_resume.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-indigo-400" />
            ATS-Safe Export Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Download your tailored documents in standard ATS-compatible formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            Print to PDF
          </button>
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            {isExportingDocx ? "Generating..." : "Download Word (.DOCX)"}
          </button>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Resume PDF / Print */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-400" />
              Printable ATS Resume
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Single Column
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict single-column ATS formatting without tables or graphics. Use Chrome or Safari&apos;s Print preview and choose &ldquo;Save as PDF&rdquo;.
          </p>
          <button
            onClick={handlePrintPdf}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Open Print / Save PDF Dialog
          </button>
        </div>

        {/* Card 2: Word DOCX */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              ATS Word Document (.DOCX)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Microsoft Word
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Semantic headings, bullet styles, and 0.75-inch margins. Preferred format for Taleo, Workday, and Greenhouse ATS scanners.
          </p>
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExportingDocx ? "Generating DOCX..." : "Download Word (.DOCX)"}
          </button>
        </div>

        {/* Card 3: Cover Letter */}
        {result?.cover_letter && (
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Tailored Cover Letter
              </h3>
              <button
                onClick={() => handleCopy(result.cover_letter, "cl")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700"
              >
                {copyState === "cl" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copyState === "cl" ? "Copied" : "Copy Letter"}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
              {result.cover_letter}
            </div>
          </div>
        )}

        {/* Card 4: LinkedIn Content */}
        {result?.linkedin && (result.linkedin.headline || result.linkedin.about) && (
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                LinkedIn Headline & About
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Target Headline</span>
                  <button
                    onClick={() => handleCopy(result.linkedin.headline, "li-head")}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {copyState === "li-head" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white">
                  {result.linkedin.headline}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">About Section</span>
                  <button
                    onClick={() => handleCopy(result.linkedin.about, "li-about")}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {copyState === "li-about" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.linkedin.about}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 5: JSON Export */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-slate-400" />
              Raw Structured JSON
            </h3>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Download .json
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Export the complete schema-validated JSON data for API integrations or external backups.
          </p>
        </div>
      </div>

      {/* Printable Resume Preview Hidden during normal view, styled specifically for @media print */}
      <div id="printable-resume" className="hidden print:block bg-white text-black p-10 font-serif max-w-4xl mx-auto">
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold uppercase">{activeResume.contact.name}</h1>
          <p className="text-xs text-gray-600 mt-1">
            {[
              activeResume.contact.email,
              activeResume.contact.phone,
              activeResume.contact.location,
              activeResume.contact.linkedin,
              activeResume.contact.github,
            ]
              .filter(Boolean)
              .join(" | ")}
          </p>
        </div>

        {activeResume.summary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-gray-800">{activeResume.summary}</p>
          </div>
        )}

        {activeResume.skills && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-1.5">
              Technical Skills
            </h2>
            <div className="text-xs space-y-0.5 text-gray-800">
              {Object.entries(activeResume.skills).map(([cat, list]) =>
                list?.length ? (
                  <p key={cat}>
                    <strong>{cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:</strong>{" "}
                    {list.join(", ")}
                  </p>
                ) : null
              )}
            </div>
          </div>
        )}

        {activeResume.experience?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-1.5">
              Experience
            </h2>
            {activeResume.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="font-normal text-gray-600">{exp.dates}</span>
                </div>
                <ul className="list-disc pl-4 text-xs mt-1 space-y-0.5 text-gray-800">
                  {exp.bullets.map((b, bI) => (
                    <li key={bI}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeResume.projects?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-1.5">
              Projects
            </h2>
            {activeResume.projects.map((proj, pI) => (
              <div key={pI} className="mb-2">
                <p className="text-xs font-bold">
                  {proj.name} {proj.technologies?.length ? `| ${proj.technologies.join(", ")}` : ""}
                </p>
                <ul className="list-disc pl-4 text-xs mt-0.5 space-y-0.5 text-gray-800">
                  {proj.bullets.map((b, bI) => (
                    <li key={bI}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeResume.education?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-1.5">
              Education
            </h2>
            {activeResume.education.map((edu, eI) => (
              <div key={eI} className="text-xs">
                <p className="font-bold">
                  {edu.degree}, {edu.institution} {edu.dates ? `(${edu.dates})` : ""}
                </p>
                {edu.details && <p className="text-gray-600">{edu.details}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
