"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RiskHeatmap } from "@/components/charts/RiskHeatmap";
import { ApplicantRow } from "@/components/ApplicantRow";
import { fetchApplicants, fetchHeatmap, EXPORT_CSV_URL } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";
import type { LoanApplicant } from "@/lib/types";

export default function LenderPage() {
  const [applicants, setApplicants] = useState<LoanApplicant[] | null>(null);
  const [heatmap, setHeatmap] = useState<Awaited<ReturnType<typeof fetchHeatmap>> | null>(null);
  const { pushToast } = useToast();

  useEffect(() => {
    fetchApplicants().then(setApplicants).catch(() => setApplicants([]));
    fetchHeatmap().then(setHeatmap).catch(() => setHeatmap(null));
  }, []);

  const handleExport = () => {
    window.open(EXPORT_CSV_URL, "_blank");
    pushToast({
      tone: "success",
      title: "Export started",
      description: "gigscore-risk-report.csv is downloading in a new tab.",
    });
  };

  const pendingCount = applicants?.filter((a) => a.status === "pending").length ?? 0;

  return (
    <AppShell title="Lender Risk Console" subtitle="Review, score, and act on gig-worker credit applications.">
      <div className="grid gap-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Applicants in pool" value={applicants?.length ?? "—"} accent="#3DF2FF" />
          <StatCard label="Pending decisions" value={pendingCount} accent="#F5D547" />
          <StatCard
            label="Avg. score"
            value={
              applicants?.length
                ? Math.round(applicants.reduce((s, a) => s + a.score, 0) / applicants.length)
                : "—"
            }
            accent="#00FF87"
          />
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-sm">Risk Assessment Heatmap</h3>
            <span className="text-[11px] text-white/40">Applicant count by score band × platform</span>
          </div>
          {heatmap ? (
            <RiskHeatmap data={heatmap} />
          ) : (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
          )}
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-glow" />
              <h3 className="font-display font-semibold text-sm">Loan Applications</h3>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {!applicants ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {applicants.map((a) => (
                <ApplicantRow key={a.id} applicant={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-xs text-white/50 font-medium">{label}</p>
      <p className="text-3xl font-display font-bold mt-1.5 tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
