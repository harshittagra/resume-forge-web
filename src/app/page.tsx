"use client";

import { useState, useEffect } from "react";
import Navbar, { NavTab } from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import ProfileView from "@/components/ProfileView";
import TailorView from "@/components/TailorView";
import DiffView from "@/components/DiffView";
import SkillGapView from "@/components/SkillGapView";
import ExportView from "@/components/ExportView";
import HistoryView from "@/components/HistoryView";
import ApiKeyModal from "@/components/ApiKeyModal";
import { SAMPLE_MASTER_RESUME } from "@/lib/sampleResume";
import { MasterResume, TailoredResult, HistoryEntry } from "@/types/resume";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [masterResume, setMasterResume] = useState<MasterResume>(SAMPLE_MASTER_RESUME);
  const [tailoredResult, setTailoredResult] = useState<TailoredResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>("");

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem("resumeforge_resume");
      if (savedResume) {
        setMasterResume(JSON.parse(savedResume));
      }

      const savedHistory = localStorage.getItem("resumeforge_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      const savedKey = localStorage.getItem("resumeforge_groq_key");
      if (savedKey) {
        setCustomApiKey(savedKey);
      }
    } catch (e) {
      console.error("Failed to load saved state:", e);
    }
  }, []);

  const handleSaveResume = (updated: MasterResume) => {
    setMasterResume(updated);
    try {
      localStorage.setItem("resumeforge_resume", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSample = () => {
    handleSaveResume(SAMPLE_MASTER_RESUME);
  };

  const handleTailored = (result: TailoredResult) => {
    setTailoredResult(result);

    // Add to history
    const newEntry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: result.timestamp,
      role_title: result.diffs[0]?.role || "Target Role",
      company: result.diffs[0]?.company || "Target Company",
      score_before: result.score_before.overall_score,
      score_after: result.score_after.overall_score,
      gaps_count: result.score_after.skill_gaps.length,
      changes_count: result.diffs.reduce((acc, d) => acc + d.bullet_diffs.length, 0),
      result,
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem("resumeforge_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("resumeforge_history");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      localStorage.setItem("resumeforge_groq_key", key);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasApiKey={Boolean(customApiKey || process.env.NEXT_PUBLIC_HAS_GROQ || true)}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "dashboard" && (
          <DashboardView
            resume={masterResume}
            result={tailoredResult}
            history={history}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
            onLoadSample={handleLoadSample}
          />
        )}

        {currentTab === "profile" && (
          <ProfileView
            resume={masterResume}
            onSave={handleSaveResume}
            onLoadSample={handleLoadSample}
          />
        )}

        {currentTab === "tailor" && (
          <TailorView
            resume={masterResume}
            result={tailoredResult}
            onTailored={handleTailored}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
            customApiKey={customApiKey}
          />
        )}

        {currentTab === "diff" && (
          <DiffView
            result={tailoredResult}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
          />
        )}

        {currentTab === "skills" && (
          <SkillGapView
            result={tailoredResult}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
          />
        )}

        {currentTab === "export" && (
          <ExportView
            resume={masterResume}
            result={tailoredResult}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
          />
        )}

        {currentTab === "history" && (
          <HistoryView
            history={history}
            onSelectHistory={(res) => {
              setTailoredResult(res);
              setCurrentTab("diff");
            }}
            onClearHistory={handleClearHistory}
            onNavigate={(tab) => setCurrentTab(tab as NavTab)}
          />
        )}
      </main>

      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        currentKey={customApiKey}
        onSaveKey={handleSaveApiKey}
      />

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          ResumeForge • 100% Free AI ATS Resume Tailor • Built with Next.js, Groq Llama 3.3, and Vercel
        </p>
      </footer>
    </div>
  );
}
