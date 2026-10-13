"use client";

import { useState } from "react";
import { Key, Shield, Check, ExternalLink, X } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
}: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3>Groq API Key Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ResumeForge uses Groq&apos;s free tier to run ultra-fast Llama 3.3 70B inference without incurring any cost.
        </p>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 block uppercase">
            Groq API Key (gsk_...)
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="gsk_..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
          />
        </div>

        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
          <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>Your key is stored safely in your browser session and never logged or shared.</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            Get Free Key on Groq <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
            {saved ? "Saved!" : "Save Key"}
          </button>
        </div>
      </div>
    </div>
  );
}
