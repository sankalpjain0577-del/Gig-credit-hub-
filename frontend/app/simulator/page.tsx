"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/ScoreGauge";
import { BreakdownBars } from "@/components/charts/BreakdownBars";
import { calculateScore } from "@/lib/api";
import { formatInr, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";
import type { GigScoreResult, ScoreSimulatorInputs } from "@/lib/types";

const DEFAULT_INPUTS: ScoreSimulatorInputs = {
  avgMonthlyEarningsInr: 28000,
  monthlyUpiTransactionCount: 60,
  upiActiveStreakMonths: 9,
  workingDurationMonths: 18,
  activePlatformsCount: 2,
  onTimePaymentPercentage: 80,
  monthlyBillCount: 5,
  avgWalletBalanceInr: 6000,
};

interface SliderConfig {
  key: keyof ScoreSimulatorInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: "avgMonthlyEarningsInr",
    label: "Average Monthly Earnings",
    min: 5000,
    max: 90000,
    step: 500,
    format: formatInr,
  },
  {
    key: "monthlyUpiTransactionCount",
    label: "Monthly UPI Transaction Count",
    min: 0,
    max: 150,
    step: 1,
    unit: "txns",
  },
  {
    key: "upiActiveStreakMonths",
    label: "UPI Active Streak",
    min: 0,
    max: 24,
    step: 1,
    unit: "months",
  },
  {
    key: "workingDurationMonths",
    label: "Working Platform Duration",
    min: 0,
    max: 60,
    step: 1,
    unit: "months",
  },
  {
    key: "activePlatformsCount",
    label: "Active Gig Platforms",
    min: 1,
    max: 6,
    step: 1,
    unit: "platforms",
  },
  {
    key: "onTimePaymentPercentage",
    label: "On-Time Bill Payment Rate",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
  },
  {
    key: "monthlyBillCount",
    label: "Monthly Utility Bill Frequency",
    min: 0,
    max: 15,
    step: 1,
    unit: "bills/mo",
  },
  {
    key: "avgWalletBalanceInr",
    label: "Average Wallet Balance",
    min: 0,
    max: 60000,
    step: 500,
    format: formatInr,
  },
];

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<ScoreSimulatorInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<GigScoreResult | null>(null);
  const [lastTier, setLastTier] = useState<string | null>(null);
  const { pushToast } = useToast();

  useEffect(() => {
    const handle = setTimeout(() => {
      calculateScore(inputs)
        .then((data) => {
          setResult((prev) => {
            if (prev && data.tier.label !== prev.tier.label) {
              pushToast({
                tone: data.score > prev.score ? "success" : "warning",
                title: `Tier changed to ${data.tier.label}`,
                description: `Your simulated GigScore is now ${data.score}.`,
              });
            }
            return data;
          });
        })
        .catch(() => {});
    }, 180);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const update = (key: keyof ScoreSimulatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setInputs(DEFAULT_INPUTS);
    pushToast({ tone: "info", title: "Simulator reset", description: "Inputs restored to defaults." });
  };

  return (
    <AppShell
      title="Scoring Engine Simulator"
      subtitle="Tune the levers below to see how the GigScore model responds in real time."
    >
      <div className="grid xl:grid-cols-[1fr_360px] gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-glow" />
              <h3 className="font-display font-semibold text-sm">Input Parameters</h3>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {SLIDERS.map((slider) => (
              <div key={slider.key}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-medium text-white/60">{slider.label}</label>
                  <span className="text-sm font-semibold text-emerald-glow tabular-nums">
                    {slider.format
                      ? slider.format(inputs[slider.key])
                      : `${inputs[slider.key]} ${slider.unit || ""}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={inputs[slider.key]}
                  onChange={(e) => update(slider.key, Number(e.target.value))}
                  className="w-full accent-emerald-glow"
                />
                <div className="flex justify-between mt-1 text-[10px] text-white/25">
                  <span>{slider.format ? slider.format(slider.min) : slider.min}</span>
                  <span>{slider.format ? slider.format(slider.max) : slider.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            layout
            className="glass-panel rounded-3xl p-6 flex flex-col items-center border-glow-emerald"
          >
            {result ? (
              <ScoreGauge
                score={result.score}
                tierLabel={result.tier.label}
                tone={result.tier.tone}
                size={240}
                subtitle="Simulated Score"
              />
            ) : (
              <div className="h-[240px] flex items-center justify-center text-white/30 text-sm">
                Calculating...
              </div>
            )}
          </motion.div>

          {result && (
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="font-display font-semibold text-sm mb-4">Live Composition</h3>
              <BreakdownBars breakdown={result.breakdown} weights={result.weights} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
