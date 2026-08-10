/**
 * GigScore Scoring Engine
 * ------------------------
 * A weighted, explainable alternative-credit-scoring model for gig workers
 * and freelancers who lack traditional credit bureau history.
 *
 * Score range: 300 - 850 (mirrors familiar FICO-style ranges so lenders and
 * workers can reason about it intuitively).
 *
 * The model blends five signal families, each normalized to a 0-100 sub-score,
 * then combined with fixed weights into a final composite score.
 */

const SCORE_MIN = 300;
const SCORE_MAX = 850;
const SCORE_RANGE = SCORE_MAX - SCORE_MIN;

// Relative importance of each signal family. Must sum to 1.
const WEIGHTS = Object.freeze({
  earningsStability: 0.28, // consistency & trend of monthly gig earnings
  transactionConsistency: 0.22, // UPI transaction frequency / regularity
  platformTenure: 0.15, // how long + how diversified across gig platforms
  billPaymentHistory: 0.2, // on-time utility & bill payments
  walletRetention: 0.15, // average wallet / bank buffer retained
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Normalizes a raw value on [0, cap] to a 0-100 sub-score. */
function normalize(value, cap) {
  return clamp((value / cap) * 100, 0, 100);
}

/**
 * 1. Earnings Stability
 * Rewards higher average monthly earnings AND low volatility (measured as
 * coefficient of variation across the last 6 months of income samples).
 */
function scoreEarningsStability({ avgMonthlyEarningsInr, monthlyEarningsHistory = [] }) {
  const earningsLevel = normalize(avgMonthlyEarningsInr, 60000); // 60k+/mo caps this sub-metric

  let volatilityScore = 70; // neutral default when no history supplied
  if (monthlyEarningsHistory.length >= 2) {
    const mean =
      monthlyEarningsHistory.reduce((a, b) => a + b, 0) / monthlyEarningsHistory.length;
    const variance =
      monthlyEarningsHistory.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      monthlyEarningsHistory.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;
    // Lower CoV -> higher stability score
    volatilityScore = clamp(100 - coefficientOfVariation * 150, 0, 100);
  }

  const subScore = earningsLevel * 0.55 + volatilityScore * 0.45;
  return {
    subScore: Math.round(subScore),
    detail: {
      earningsLevel: Math.round(earningsLevel),
      volatilityScore: Math.round(volatilityScore),
    },
  };
}

/**
 * 2. Transaction Consistency (UPI)
 * Rewards frequent, regular UPI transactions and an active streak of
 * consecutive weeks/months with activity.
 */
function scoreTransactionConsistency({ monthlyUpiTransactionCount, upiActiveStreakMonths }) {
  const frequencyScore = normalize(monthlyUpiTransactionCount, 120); // 120+ txns/mo caps
  const streakScore = normalize(upiActiveStreakMonths, 18); // 18mo+ streak caps
  const subScore = frequencyScore * 0.6 + streakScore * 0.4;
  return {
    subScore: Math.round(subScore),
    detail: {
      frequencyScore: Math.round(frequencyScore),
      streakScore: Math.round(streakScore),
    },
  };
}

/**
 * 3. Platform Tenure & Diversification
 * Rewards longer working history and diversification across multiple gig
 * platforms (reduces single-platform dependency risk).
 */
function scorePlatformTenure({ workingDurationMonths, activePlatformsCount }) {
  const tenureScore = normalize(workingDurationMonths, 48); // 4 years caps
  const diversificationScore = normalize(activePlatformsCount, 4); // 4+ platforms caps
  const subScore = tenureScore * 0.65 + diversificationScore * 0.35;
  return {
    subScore: Math.round(subScore),
    detail: {
      tenureScore: Math.round(tenureScore),
      diversificationScore: Math.round(diversificationScore),
    },
  };
}

/**
 * 4. Bill & Utility Payment History
 * Directly rewards the on-time payment percentage; late payments penalize
 * disproportionately since they are the strongest traditional risk signal.
 */
function scoreBillPaymentHistory({ onTimePaymentPercentage, monthlyBillCount }) {
  const punctualityScore = clamp(onTimePaymentPercentage, 0, 100);
  const volumeConfidence = normalize(monthlyBillCount, 8); // more bills tracked = more confidence
  const subScore = punctualityScore * 0.8 + volumeConfidence * 0.2;
  return {
    subScore: Math.round(subScore),
    detail: {
      punctualityScore: Math.round(punctualityScore),
      volumeConfidence: Math.round(volumeConfidence),
    },
  };
}

/**
 * 5. Wallet / Bank Buffer Retention
 * Rewards workers who maintain a healthy average balance relative to their
 * earnings (a proxy for financial cushioning and shock resilience).
 */
function scoreWalletRetention({ avgWalletBalanceInr, avgMonthlyEarningsInr }) {
  const bufferRatio =
    avgMonthlyEarningsInr > 0 ? avgWalletBalanceInr / avgMonthlyEarningsInr : 0;
  const subScore = normalize(bufferRatio, 0.6); // holding 60%+ of monthly earnings caps this
  return {
    subScore: Math.round(subScore),
    detail: {
      bufferRatioPercent: Math.round(bufferRatio * 100),
    },
  };
}

function riskTier(score) {
  if (score >= 780) return { label: "Excellent", tone: "excellent" };
  if (score >= 700) return { label: "Very Good", tone: "good" };
  if (score >= 620) return { label: "Good", tone: "moderate" };
  if (score >= 540) return { label: "Fair", tone: "watch" };
  return { label: "Needs Building", tone: "risk" };
}

/**
 * Runs the full weighted scoring model.
 * @param {object} inputs - raw financial + behavioral metrics
 * @returns {object} full breakdown including composite score and risk tier
 */
function calculateGigScore(inputs) {
  const earningsStability = scoreEarningsStability(inputs);
  const transactionConsistency = scoreTransactionConsistency(inputs);
  const platformTenure = scorePlatformTenure(inputs);
  const billPaymentHistory = scoreBillPaymentHistory(inputs);
  const walletRetention = scoreWalletRetention(inputs);

  const weightedComposite =
    earningsStability.subScore * WEIGHTS.earningsStability +
    transactionConsistency.subScore * WEIGHTS.transactionConsistency +
    platformTenure.subScore * WEIGHTS.platformTenure +
    billPaymentHistory.subScore * WEIGHTS.billPaymentHistory +
    walletRetention.subScore * WEIGHTS.walletRetention;

  // Map 0-100 composite onto SCORE_MIN..SCORE_MAX
  const gigScore = Math.round(SCORE_MIN + (weightedComposite / 100) * SCORE_RANGE);
  const tier = riskTier(gigScore);

  return {
    score: clamp(gigScore, SCORE_MIN, SCORE_MAX),
    scoreRange: { min: SCORE_MIN, max: SCORE_MAX },
    tier,
    weights: WEIGHTS,
    breakdown: {
      earningsStability,
      transactionConsistency,
      platformTenure,
      billPaymentHistory,
      walletRetention,
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Computes a micro-credit eligibility offer derived from the composite score.
 * Higher scores unlock larger limits and lower APRs.
 */
function calculateLoanEligibility(score, requestedAmountInr, tenureMonths) {
  const tier = riskTier(score);

  // Base limit scales linearly with score above the floor.
  const scoreFactor = clamp((score - SCORE_MIN) / SCORE_RANGE, 0, 1);
  const maxEligibleAmount = Math.round((5000 + scoreFactor * 145000) / 500) * 500; // 5k - 150k INR

  // APR shrinks as score rises: 34% at the floor down to 11.5% at the ceiling.
  const apr = +(34 - scoreFactor * 22.5).toFixed(2);

  const approvedAmount = Math.min(requestedAmountInr, maxEligibleAmount);
  const monthlyRate = apr / 100 / 12;
  const emi =
    monthlyRate > 0
      ? Math.round(
          (approvedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
        )
      : Math.round(approvedAmount / tenureMonths);

  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - approvedAmount;

  let decision = "approved";
  if (score < 480) decision = "declined";
  else if (score < 580 || requestedAmountInr > maxEligibleAmount * 1.5) decision = "manual_review";

  return {
    decision,
    tier,
    maxEligibleAmount,
    approvedAmount,
    apr,
    tenureMonths,
    emi,
    totalRepayment,
    totalInterest,
  };
}

module.exports = {
  calculateGigScore,
  calculateLoanEligibility,
  riskTier,
  SCORE_MIN,
  SCORE_MAX,
  WEIGHTS,
};
