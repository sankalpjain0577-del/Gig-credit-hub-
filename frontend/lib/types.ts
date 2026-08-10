export interface ScoreBreakdownItem {
  subScore: number;
  detail: Record<string, number>;
}

export interface RiskTier {
  label: string;
  tone: "excellent" | "good" | "moderate" | "watch" | "risk";
}

export interface GigScoreResult {
  score: number;
  scoreRange: { min: number; max: number };
  tier: RiskTier;
  weights: Record<string, number>;
  breakdown: {
    earningsStability: ScoreBreakdownItem;
    transactionConsistency: ScoreBreakdownItem;
    platformTenure: ScoreBreakdownItem;
    billPaymentHistory: ScoreBreakdownItem;
    walletRetention: ScoreBreakdownItem;
  };
  generatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  city: string;
  primaryPlatform: string;
  activePlatforms: string[];
  workingDurationMonths: number;
  avgMonthlyEarningsInr: number;
  monthlyEarningsHistory: number[];
  monthlyUpiTransactionCount: number;
  upiActiveStreakMonths: number;
  onTimePaymentPercentage: number;
  monthlyBillCount: number;
  avgWalletBalanceInr: number;
  verifiedCredentials: { type: string; verified: boolean }[];
  platformsDetail: Platform[];
  scoreHistory: { month: string; score: number }[];
  currentScore: GigScoreResult;
}

export interface LoanEligibility {
  decision: "approved" | "manual_review" | "declined";
  tier: RiskTier;
  maxEligibleAmount: number;
  approvedAmount: number;
  apr: number;
  tenureMonths: number;
  emi: number;
  totalRepayment: number;
  totalInterest: number;
}

export interface LoanApplicant {
  id: string;
  name: string;
  platform: string;
  city: string;
  score: number;
  requestedAmountInr: number;
  tenureMonths: number;
  tier: RiskTier;
  status: "pending" | "approved" | "manual_review" | "declined";
}

export interface ScoreSimulatorInputs {
  avgMonthlyEarningsInr: number;
  monthlyUpiTransactionCount: number;
  upiActiveStreakMonths: number;
  workingDurationMonths: number;
  activePlatformsCount: number;
  onTimePaymentPercentage: number;
  monthlyBillCount: number;
  avgWalletBalanceInr: number;
}
