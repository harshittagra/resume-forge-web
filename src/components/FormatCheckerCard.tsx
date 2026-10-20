"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { FormatCheck } from "@/types/resume";

interface FormatCheckerCardProps {
  checks: FormatCheck[];
}

export default function FormatCheckerCard({ checks }: FormatCheckerCardProps) {
  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/40 border border-indigo-500/15 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Format Compliance Score
        </h3>
        <span className={`text-lg font-extrabold ${pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-rose-400"}`}>
          {passed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            pct >= 80
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : pct >= 50
              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
              : "bg-gradient-to-r from-rose-500 to-red-400"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Individual checks */}
      <div className="space-y-2">
        {checks.map((check, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
            className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
              check.passed
                ? "bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/30"
                : check.severity === "critical"
                ? "bg-rose-500/5 border-rose-500/15 hover:border-rose-500/30"
                : "bg-amber-500/5 border-amber-500/15 hover:border-amber-500/30"
            }`}
          >
            {check.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : check.severity === "critical" ? (
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : check.severity === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">{check.rule}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  check.passed
                    ? "bg-emerald-500/10 text-emerald-400"
                    : check.severity === "critical"
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}>
                  {check.passed ? "PASS" : check.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{check.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
