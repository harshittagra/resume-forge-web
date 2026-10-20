"use client";

import {
  Flame,
  LayoutDashboard,
  UserCheck,
  Search,
  Target,
  GitCompare,
  Wrench,
  Download,
  History,
  Key,
  FileText,
  Globe,
  MessageSquare,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "profile"
  | "scan"
  | "tailor"
  | "diff"
  | "skills"
  | "coverletter"
  | "linkedin"
  | "interview"
  | "export"
  | "history";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export default function Navbar({
  currentTab,
  onSelectTab,
  hasApiKey,
  onOpenApiKeyModal,
}: NavbarProps) {
  const tabs = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "profile" as NavTab, label: "Profile", icon: UserCheck },
    { id: "scan" as NavTab, label: "ATS Scan", icon: Search },
    { id: "tailor" as NavTab, label: "Tailor", icon: Target },
    { id: "diff" as NavTab, label: "Diff", icon: GitCompare },
    { id: "skills" as NavTab, label: "Skills", icon: Wrench },
    { id: "coverletter" as NavTab, label: "Cover Letter", icon: FileText },
    { id: "linkedin" as NavTab, label: "LinkedIn", icon: Globe },
    { id: "interview" as NavTab, label: "Interview", icon: MessageSquare },
    { id: "export" as NavTab, label: "Export", icon: Download },
    { id: "history" as NavTab, label: "History", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-indigo-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-200 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  ResumeForge
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  v2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Free ATS Resume Tailor</p>
            </div>
          </div>

          {/* Desktop Nav — scrollable if needed */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-slate-900/60 p-1 rounded-2xl border border-indigo-500/15 overflow-x-auto max-w-[calc(100vw-400px)] scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Status & API Key trigger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/40 text-slate-300 transition-all hover:bg-slate-800"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">
                {hasApiKey ? "Groq Connected" : "Add API Key"}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  hasApiKey ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex overflow-x-auto gap-1 px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
