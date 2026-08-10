"use client";

import { motion } from "framer-motion";
import type { GigScoreResult } from "@/lib/types";

const LABELS: Record<string, string> = {
  earningsStability: "Earnings Stability",
  transactionConsistency: "UPI Transaction Consistency",
  platformTenure: "Platform Tenure & Diversity",
  billPaymentHistory: "Bill Payment History",
  walletRetention: "Wallet Retention",
};

export function BreakdownBars({ breakdown, weights }: Pick<GigScoreResult, "breakdown" | "weights">) {
  const entries = Object.entries(breakdown) as [keyof typeof breakdown, { subScore: number }][];

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([key, val], i) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/70">{LABELS[key]}</span>
            <span className="text-xs text-white/40">
              {val.subScore}/100 · {Math.round(weights[key] * 100)}% weight
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${val.subScore}%` }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-glow to-cyan-glow"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
