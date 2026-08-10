const express = require("express");
const { calculateGigScore, calculateLoanEligibility } = require("../engine/scoringEngine");

const router = express.Router();

const REQUIRED_FIELDS = [
  "avgMonthlyEarningsInr",
  "monthlyUpiTransactionCount",
  "workingDurationMonths",
  "onTimePaymentPercentage",
];

function validatePayload(body) {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof body[field] !== "number" || Number.isNaN(body[field])) {
      errors.push(`Field ${field} must be a number`);
    }
  }
  return errors;
}

/**
 * POST /api/score/calculate
 * Accepts alternative financial + behavioral metrics and returns the full
 * weighted GigScore breakdown.
 */
router.post("/calculate", (req, res) => {
  const payload = req.body || {};
  const errors = validatePayload(payload);
  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  const inputs = {
    avgMonthlyEarningsInr: Number(payload.avgMonthlyEarningsInr),
    monthlyEarningsHistory: Array.isArray(payload.monthlyEarningsHistory)
      ? payload.monthlyEarningsHistory.map(Number)
      : [],
    monthlyUpiTransactionCount: Number(payload.monthlyUpiTransactionCount),
    upiActiveStreakMonths: Number(payload.upiActiveStreakMonths ?? 6),
    workingDurationMonths: Number(payload.workingDurationMonths),
    activePlatformsCount: Number(payload.activePlatformsCount ?? 1),
    onTimePaymentPercentage: Number(payload.onTimePaymentPercentage),
    monthlyBillCount: Number(payload.monthlyBillCount ?? 4),
    avgWalletBalanceInr: Number(
      payload.avgWalletBalanceInr ?? Number(payload.avgMonthlyEarningsInr) * 0.2
    ),
  };

  const result = calculateGigScore(inputs);

  res.status(200).json({ success: true, data: result });
});

/**
 * POST /api/score/loan-eligibility
 * Given a score plus requested amount/tenure, returns EMI + eligibility.
 */
router.post("/loan-eligibility", (req, res) => {
  const { score, requestedAmountInr, tenureMonths } = req.body || {};

  if (
    typeof score !== "number" ||
    typeof requestedAmountInr !== "number" ||
    typeof tenureMonths !== "number"
  ) {
    return res.status(400).json({
      success: false,
      errors: ["score, requestedAmountInr, and tenureMonths must all be numbers"],
    });
  }

  const eligibility = calculateLoanEligibility(score, requestedAmountInr, tenureMonths);
  res.status(200).json({ success: true, data: eligibility });
});

module.exports = router;
