import type {
  GigScoreResult,
  LoanApplicant,
  LoanEligibility,
  ScoreSimulatorInputs,
  WorkerProfile,
} from "./types";

/**
 * All requests go through Next.js's `/api/*` rewrite (see next.config.js),
 * which proxies to the Express backend. This avoids CORS friction in dev
 * and keeps the backend URL configurable via NEXT_PUBLIC_API_BASE_URL.
 */

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    const message = Array.isArray(json.errors) ? json.errors.join(", ") : "Request failed";
    throw new Error(message);
  }
  return json.data as T;
}

export function calculateScore(inputs: ScoreSimulatorInputs) {
  return request<GigScoreResult>("/api/score/calculate", {
    method: "POST",
    body: JSON.stringify(inputs),
  });
}

export function fetchLoanEligibility(
  score: number,
  requestedAmountInr: number,
  tenureMonths: number
) {
  return request<LoanEligibility>("/api/score/loan-eligibility", {
    method: "POST",
    body: JSON.stringify({ score, requestedAmountInr, tenureMonths }),
  });
}

export function fetchUserMetrics() {
  return request<WorkerProfile>("/api/user/metrics");
}

export function applyForLoan(
  score: number,
  requestedAmountInr: number,
  tenureMonths: number,
  applicantName?: string
) {
  return request<LoanEligibility & { id: string; disbursementEtaMinutes: number | null }>(
    "/api/loan/apply",
    {
      method: "POST",
      body: JSON.stringify({ score, requestedAmountInr, tenureMonths, applicantName }),
    }
  );
}

export function fetchApplicants() {
  return request<LoanApplicant[]>("/api/lender/applicants");
}

export function decideApplicant(id: string, action: "approve" | "review" | "decline") {
  return request<LoanApplicant>(`/api/lender/applicants/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

export function fetchHeatmap() {
  return request<{
    platforms: string[];
    matrix: { band: string; cells: { platform: string; count: number }[] }[];
  }>("/api/lender/heatmap");
}

export const EXPORT_CSV_URL = "/api/lender/export";
