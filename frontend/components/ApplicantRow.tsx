"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, X, Loader2 } from "lucide-react";
import { decideApplicant } from "@/lib/api";
import { formatInr, riskToneColor, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastProvider";
import type { LoanApplicant } from "@/lib/types";

const STATUS_LABEL: Record<LoanApplicant["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  manual_review: "Manual Review",
  declined: "Declined",
};

const STATUS_COLOR: Record<LoanApplicant["status"], string> = {
  pending: "#8B98A5",
  approved: "#00FF87",
  manual_review: "#F5D547",
  declined: "#FF4D6D",
};

export function ApplicantRow({ applicant }: { applicant: LoanApplicant }) {
  const [current, setCurrent] = useState(applicant);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { pushToast } = useToast();
  const tone = riskToneColor(current.tier.tone);

  const act = async (action: "approve" | "review" | "decline") => {
    setLoadingAction(action);
    try {
      const updated = await decideApplicant(current.id, action);
      setCurrent(updated);
      pushToast({
        tone: action === "decline" ? "warning" : "success",
        title: `${current.name} → ${STATUS_LABEL[updated.status]}`,
        description: `Decision recorded for ${formatInr(current.requestedAmountInr)} request.`,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 flex flex-wrap items-center gap-4"
    >
      <div className="flex items-center gap-3 min-w-[190px] flex-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
          style={{ backgroundColor: `${tone}18`, color: tone, border: `1px solid ${tone}40` }}
        >
          {current.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{current.name}</p>
          <p className="text-[11px] text-white/40 truncate">
            {current.platform} · {current.city}
          </p>
        </div>
      </div>

      <div className="text-center min-w-[70px]">
        <p className="text-lg font-display font-bold tabular-nums" style={{ color: tone }}>
          {current.score}
        </p>
        <p className="text-[10px] text-white/40">{current.tier.label}</p>
      </div>

      <div className="text-center min-w-[110px]">
        <p className="text-sm font-semibold tabular-nums">{formatInr(current.requestedAmountInr)}</p>
        <p className="text-[10px] text-white/40">{current.tenureMonths} mo tenure</p>
      </div>

      <span
        className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
        style={{
          color: STATUS_COLOR[current.status],
          borderColor: `${STATUS_COLOR[current.status]}40`,
          backgroundColor: `${STATUS_COLOR[current.status]}14`,
        }}
      >
        {STATUS_LABEL[current.status]}
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <ActionButton
          label="Approve"
          icon={Check}
          color="#00FF87"
          loading={loadingAction === "approve"}
          onClick={() => act("approve")}
        />
        <ActionButton
          label="Review"
          icon={Eye}
          color="#F5D547"
          loading={loadingAction === "review"}
          onClick={() => act("review")}
        />
        <ActionButton
          label="Decline"
          icon={X}
          color="#FF4D6D"
          loading={loadingAction === "decline"}
          onClick={() => act("decline")}
        />
      </div>
    </motion.div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  color,
  loading,
  onClick,
}: {
  label: string;
  icon: any;
  color: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={label}
      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-transform hover:scale-110 active:scale-95 disabled:opacity-40"
      style={{ borderColor: `${color}35`, backgroundColor: `${color}10` }}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color }} />
      ) : (
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      )}
    </button>
  );
}
