"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";
import { riskToneColor } from "@/lib/utils";

const PRESETS = [
  { score: 742, tone: "good", tier: "Very Good", label: "Delivery Partner · 27mo" },
  { score: 812, tone: "excellent", tier: "Excellent", label: "Freelance Designer · 41mo" },
  { score: 588, tone: "moderate", tier: "Good", label: "Cab Driver · 9mo" },
  { score: 501, tone: "watch", tier: "Fair", label: "New Gig Worker · 3mo" },
];

export function HeroScorePreview() {
  const [index, setIndex] = useState(0);
  const preset = PRESETS[index];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative border-glow-emerald w-full max-w-sm">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-glow/10 blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-cyan-glow/10 blur-3xl animate-pulse-glow" />

      <div className="flex items-center justify-between mb-2 relative">
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-medium">
          Live Preview
        </span>
        <button
          onClick={() => setIndex((i) => (i + 1) % PRESETS.length)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-glow hover:text-emerald-glow transition-colors"
        >
          <Shuffle className="w-3 h-3" /> Shuffle
        </button>
      </div>

      <div className="flex justify-center py-2 relative">
        <ScoreGauge score={preset.score} tierLabel={preset.tier} tone={preset.tone} size={220} />
      </div>

      <motion.p
        key={preset.label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-white/50 mt-2"
      >
        {preset.label}
      </motion.p>

      <div className="grid grid-cols-3 gap-2 mt-6 relative">
        {[
          { label: "UPI Streak", value: "14 mo" },
          { label: "On-time Bills", value: "91%" },
          { label: "Platforms", value: "3 linked" },
        ].map((stat) => (
          <div key={stat.label} className="text-center rounded-xl bg-white/[0.03] border border-white/5 py-2.5">
            <p className="text-sm font-display font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
