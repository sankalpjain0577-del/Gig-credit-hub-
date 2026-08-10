const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { calculateLoanEligibility } = require("../engine/scoringEngine");

const router = express.Router();

// In-memory ledger for demo purposes (resets on server restart)
const applications = [];

/**
 * POST /api/loan/apply
 * Simulates an instant credit line disbursement decision using the
 * applicant's current GigScore.
 */
router.post("/apply", (req, res) => {
  const { score, requestedAmountInr, tenureMonths, applicantName } = req.body || {};

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

  const application = {
    id: uuidv4(),
    applicantName: applicantName || "GigScore User",
    submittedAt: new Date().toISOString(),
    requestedAmountInr,
    tenureMonths,
    score,
    ...eligibility,
  };

  applications.unshift(application);

  // Simulate instant disbursement timing for approved applications
  const responsePayload = {
    ...application,
    disbursementEtaMinutes: application.decision === "approved" ? 2 : null,
  };

  res.status(201).json({ success: true, data: responsePayload });
});

/**
 * GET /api/loan/applications
 * Returns the in-memory ledger of simulated applications (most recent first).
 */
router.get("/applications", (req, res) => {
  res.status(200).json({ success: true, data: applications });
});

module.exports = router;
