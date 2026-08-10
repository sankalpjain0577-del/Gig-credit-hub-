"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Repeat,
  ReceiptText,
  PiggyBank,
  ShieldCheck,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/ScoreGauge";
import { MetricCard } from "@/components/MetricCard";
import { PlatformIntegrations } from "@/components/PlatformIntegrations";
import { ScoreHistoryChart } from "@/components/charts/ScoreHistoryChart";
import { BreakdownBars } from "@/components/charts/BreakdownBars";
import { LoanTerminal } from "@/components/LoanTerminal";
import { fetchUserMetrics } from "@/lib/api";
import { formatInr } from "@/lib/utils";
import type { WorkerProfile } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    fetchUserMetrics().then(setProfile).catch(() => setProfile(null));
  }, []);

  if (!profile) {
    return (
      <AppShell title="Worker Dashboard" subtitle="Loading your GigScore profile...">
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-glow" />
        </div>
      </AppShell>
    );
  }

  const { currentScore } = profile;
  const b = currentScore.breakdown;

  return (
    <AppShell
      title={`Welcome back, ${profile.name.split(" ")[0]}`}
      subtitle={`${profile.city} · ${profile.workingDurationMonths} months on GigScore`}
    >
      <div className="grid xl:grid-cols-[340px_1fr] gap-6">
        {/* Score Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-3xl p-6 flex flex-col items-center border-glow-emerald"
        >
          <ScoreGauge
            score={currentScore.score}
            tierLabel={currentScore.tier.label}
            tone={currentScore.tier.tone}
            size={260}
          />
          <div className="w-full mt-6 flex items-center gap-2 text-xs text-white/50 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-glow" />
            {profile.verifiedCredentials.filter((c) => c.verified).length}/
            {profile.verifiedCredentials.length} credentials verified
          </div>
          <div className="w-full mt-5 pt-5 border-t border-white/5">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-3">Score History</p>
            <ScoreHistoryChart data={profile.scoreHistory} />
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <MetricCard
              icon={Repeat}
              title="UPI Transaction Consistency"
              value={`${profile.monthlyUpiTransactionCount} txns/mo`}
              helper={`${profile.upiActiveStreakMonths}-month active streak`}
              progress={b.transactionConsistency.subScore}
              accent="emerald"
              badge="Live"
              delay={0}
            />
            <MetricCard
              icon={ReceiptText}
              title="Utility & Bill Payment History"
              value={`${profile.onTimePaymentPercentage}% on-time`}
              helper={`${profile.monthlyBillCount} bills tracked / mo`}
              progress={b.billPaymentHistory.subScore}
              accent="cyan"
              delay={0.05}
            />
            <MetricCard
              icon={PiggyBank}
              title="Daily Avg. Wallet Retention"
              value={formatInr(profile.avgWalletBalanceInr)}
              helper={`${b.walletRetention.detail.bufferRatioPercent}% of monthly earnings`}
              progress={b.walletRetention.subScore}
              accent="emerald"
              delay={0.1}
            />
            <MetricCard
              icon={TrendingUp}
              title="Earnings Stability"
              value={formatInr(profile.avgMonthlyEarningsInr)}
              helper="6-month rolling average"
              progress={b.earningsStability.subScore}
              accent="cyan"
              delay={0.15}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <PlatformIntegrations
              platforms={profile.platformsDetail}
              connectedIds={profile.activePlatforms}
            />
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-emerald-glow" />
                <h3 className="font-display font-semibold text-sm">Score Composition</h3>
              </div>
              <BreakdownBars breakdown={currentScore.breakdown} weights={currentScore.weights} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <LoanTerminal score={currentScore.score} />
      </div>
    </AppShell>
  );
}
