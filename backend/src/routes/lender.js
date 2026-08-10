const express = require("express");
const { LOAN_APPLICANTS } = require("../data/mockData");
const { riskTier, calculateLoanEligibility } = require("../engine/scoringEngine");

const router = express.Router();

// Mutable in-memory copy so the demo can reflect approval/review actions
let applicantPool = LOAN_APPLICANTS.map((a) => ({
  ...a,
  tier: riskTier(a.score),
  status: "pending",
}));

/**
 * GET /api/lender/applicants
 * Returns the full risk assessment pool with tiering for the heatmap.
 */
router.get("/applicants", (req, res) => {
  res.status(200).json({ success: true, data: applicantPool });
});

/**
 * POST /api/lender/applicants/:id/decision
 * Body: { action: 'approve' | 'review' | 'decline' }
 */
router.post("/applicants/:id/decision", (req, res) => {
  const { id } = req.params;
  const { action } = req.body || {};

  const validActions = ["approve", "review", "decline"];
  if (!validActions.includes(action)) {
    return res.status(400).json({
      success: false,
      errors: [`action must be one of: ${validActions.join(", ")}`],
    });
  }

  const applicant = applicantPool.find((a) => a.id === id);
  if (!applicant) {
    return res.status(404).json({ success: false, errors: ["Applicant not found"] });
  }

  const statusMap = { approve: "approved", review: "manual_review", decline: "declined" };
  applicant.status = statusMap[action];
  applicant.decidedAt = new Date().toISOString();

  res.status(200).json({ success: true, data: applicant });
});

/**
 * GET /api/lender/export
 * Simulates a batch export (CSV) of the current applicant pool.
 */
router.get("/export", (req, res) => {
  const header = [
    "id",
    "name",
    "platform",
    "city",
    "score",
    "tier",
    "requestedAmountInr",
    "tenureMonths",
    "status",
  ];

  const rows = applicantPool.map((a) =>
    [a.id, a.name, a.platform, a.city, a.score, a.tier.label, a.requestedAmountInr, a.tenureMonths, a.status].join(
      ","
    )
  );

  const csv = [header.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=gigscore-risk-report.csv");
  res.status(200).send(csv);
});

/**
 * GET /api/lender/heatmap
 * Aggregates applicants into a score-band x platform matrix for the
 * risk-assessment heatmap visualization.
 */
router.get("/heatmap", (req, res) => {
  const bands = [
    { label: "300-479", min: 300, max: 479 },
    { label: "480-579", min: 480, max: 579 },
    { label: "580-669", min: 580, max: 669 },
    { label: "670-749", min: 670, max: 749 },
    { label: "750-850", min: 750, max: 850 },
  ];

  const platforms = [...new Set(applicantPool.map((a) => a.platform))];

  const matrix = bands.map((band) => ({
    band: band.label,
    cells: platforms.map((platform) => ({
      platform,
      count: applicantPool.filter(
        (a) => a.platform === platform && a.score >= band.min && a.score <= band.max
      ).length,
    })),
  }));

  res.status(200).json({ success: true, data: { platforms, matrix } });
});

module.exports = router;
