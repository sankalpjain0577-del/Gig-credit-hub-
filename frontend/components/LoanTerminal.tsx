"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Terminal, Loader2, ArrowRight } from "lucide-react";
import { fetchLoanEligibility, applyForLoan } from "@/lib/api";
import { formatInr, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";
import type { LoanEligibility } from "@/lib/types";

const DECISION_COPY: Record<LoanEligibility["decision"], { label: string; color: string }> = {
  approved: { label: "Instantly Approved", color: "#00FF87" },
  manual_review: { label: "Manual Review Required", color: "#F5D547" },
  declined: { label: "Not Eligible Yet", color: "#FF4D6D" },
};

export function LoanTerminal({ score }: { score: number }) {
  const [amount, setAmount] = useState(25000);
  const [tenure, setTenure] = useState(6);
  const [result, setResult] = useState<LoanEligibility | null>(null);
  const [isPending, startTransition] = useTransition();
  const [applying, setApplying] = useState(false);
  const { pushToast } = useToast();

  useEffect(() => {
    let active = true;
    startTransition(() => {
      fetchLoanEligibility(score, amount, tenure)
        .then((data) => {
          if (active) setResult(data);
        })
        .catch(() => {
          if (active) setResult(null);
        });
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, amount, tenure]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const app = await applyForLoan(score, amount, tenure, "Ananya Rao");
      pushToast({
        tone: app.decision === "approved" ? "success" : app.decision === "declined" ? "warning" : "info",
        title: DECISION_COPY[app.decision].label,
        description:
          app.decision === "approved"
            ? `${formatInr(app.approvedAmount)} disbursing in ~${app.disbursementEtaMinutes} min at ${app.apr}% APR.`
            : app.decision === "manual_review"
            ? "A lender partner will review your application within 24 hours."
            : "Improve your GigScore by boosting UPI consistency and bill payment history.",
      });
    } catch (e) {
      pushToast({ tone: "warning", title: "Application failed", description: "Please try again." });
    } finally {
      setApplying(false);
    }
  };

  const decisionMeta = result ? DECISION_COPY[result.decision] : null;

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-glow/10 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 mb-6 relative">
        <div className="w-9 h-9 rounded-lg bg-emerald-glow/10 border border-emerald-glow/30 flex items-center justify-center">
          <Terminal className="w-4.5 h-4.5 text-emerald-glow" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">Micro-Credit Eligibility Terminal</h3>
          <p className="text-[11px] text-white/40">Live limit calculator based on your current GigScore</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 relative">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-white/60">Loan Amount</label>
              <span className="text-sm font-semibold text-emerald-glow tabular-nums">
                {formatInr(amount)}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={150000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-emerald-glow"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-medium text-white/60">Tenure</label>
              <span className="text-sm font-semibold text-cyan-glow tabular-nums">{tenure} months</span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-cyan-glow"
            />
          </div>

          <button
            onClick={handleApply}
            disabled={applying || !result || result.decision === "declined"}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all",
              "bg-gradient-to-r from-emerald-glow to-cyan-glow text-charcoal-950 shadow-glow-emerald",
              "disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
            )}
          >
            {applying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Apply for Instant Credit Line <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-5 font-mono text-xs relative">
          {isPending && !result && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
          )}
          {result && (
            <motion.div
              key={`${amount}-${tenure}`}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="space-y-2.5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: decisionMeta!.color, boxShadow: `0 0 8px ${decisionMeta!.color}` }}
                />
                <span className="font-semibold" style={{ color: decisionMeta!.color }}>
                  {decisionMeta!.label}
                </span>
              </div>
              <Row label="Approved amount" value={formatInr(result.approvedAmount)} />
              <Row label="Max eligible limit" value={formatInr(result.maxEligibleAmount)} />
              <Row label="Estimated APR" value={`${result.apr}%`} />
              <Row label="Monthly EMI" value={formatInr(result.emi)} />
              <Row label="Total repayment" value={formatInr(result.totalRepayment)} />
              <Row label="Total interest" value={formatInr(result.totalInterest)} highlight />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
      <span className="text-white/40">{label}</span>
      <span className={cn("font-semibold tabular-nums", highlight ? "text-cyan-glow" : "text-white/85")}>
        {value}
      </span>
    </div>
  );
}
