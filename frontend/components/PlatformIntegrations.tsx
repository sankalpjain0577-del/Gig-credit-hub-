"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Platform } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

export function PlatformIntegrations({
  platforms,
  connectedIds,
}: {
  platforms: Platform[];
  connectedIds: string[];
}) {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map((p) => [p.id, connectedIds.includes(p.id)]))
  );
  const { pushToast } = useToast();

  const toggle = (platform: Platform) => {
    setConnected((prev) => {
      const next = !prev[platform.id];
      pushToast({
        tone: next ? "success" : "info",
        title: next ? `${platform.name} connected` : `${platform.name} disconnected`,
        description: next
          ? "Earnings frequency data will sync into your next score refresh."
          : "This platform's earnings will no longer count toward your score.",
      });
      return { ...prev, [platform.id]: next };
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm">Platform Earnings Frequency</h3>
        <span className="text-[11px] text-white/40">
          {Object.values(connected).filter(Boolean).length}/{platforms.length} linked
        </span>
      </div>
      <div className="flex flex-col divide-y divide-white/5">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: platform.color, boxShadow: `0 0 8px ${platform.color}` }}
              />
              <div>
                <p className="text-sm font-medium text-white/90">{platform.name}</p>
                <p className="text-[11px] text-white/40">{platform.category}</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={connected[platform.id]}
              onClick={() => toggle(platform)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0",
                connected[platform.id] ? "bg-emerald-glow/90" : "bg-white/10"
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-charcoal-950 shadow-md",
                  connected[platform.id] ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
