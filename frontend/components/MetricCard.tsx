"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  helper?: string;
  progress?: number; // 0-100
  accent?: "emerald" | "cyan";
  badge?: string;
  delay?: number;
}

export function MetricCard({
  icon: Icon,
  title,
  value,
  helper,
  progress,
  accent = "emerald",
  badge,
  delay = 0,
}: MetricCardProps) {
  const accentColor = accent === "emerald" ? "#00FF87" : "#3DF2FF";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="glass-panel rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-card-sheen pointer-events-none" />
      <div className="flex items-start justify-between relative">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{
            backgroundColor: `${accentColor}14`,
            borderColor: `${accentColor}30`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={2} />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
            {badge}
          </span>
        )}
      </div>

      <p className="text-xs text-white/50 mt-4 font-medium">{title}</p>
      <p className="text-2xl font-display font-bold mt-1 tabular-nums">{value}</p>
      {helper && <p className="text-[11px] text-white/40 mt-1">{helper}</p>}

      {typeof progress === "number" && (
        <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, #3DF2FF)`,
              boxShadow: `0 0 12px ${accentColor}80`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
