"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export default function ScoreGauge({
  score,
  label = "ATS Match Score",
  size = 170,
}: ScoreGaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return { stroke: "#22c55e", text: "text-emerald-400", bg: "rgba(34,197,94,0.12)", badge: "Strong Match" };
    if (s >= 50) return { stroke: "#f59e0b", text: "text-amber-400", bg: "rgba(245,158,11,0.12)", badge: "Moderate Match" };
    return { stroke: "#ef4444", text: "text-rose-400", bg: "rgba(239,68,68,0.12)", badge: "Needs Tailoring" };
  };

  const current = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Ambient glow behind gauge */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40 transition-colors duration-700"
          style={{ background: current.stroke }}
        />

        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated gradient progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={current.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-4xl font-extrabold tracking-tight ${current.text}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all"
          style={{
            color: current.stroke,
            borderColor: `${current.stroke}40`,
            backgroundColor: current.bg,
          }}
        >
          {current.badge}
        </span>
        <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
