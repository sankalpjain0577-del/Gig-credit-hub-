const express = require("express");
const { getWorkerProfile, PLATFORMS } = require("../data/mockData");

const router = express.Router();

/**
 * GET /api/user/metrics
 * Returns the mock authenticated worker's profile, transaction histories,
 * verified credentials, and current GigScore breakdown.
 */
router.get("/metrics", (req, res) => {
  const profile = getWorkerProfile();
  res.status(200).json({ success: true, data: profile });
});

/**
 * GET /api/user/platforms
 * Returns the catalog of supported gig platforms available for linking.
 */
router.get("/platforms", (req, res) => {
  res.status(200).json({ success: true, data: PLATFORMS });
});

module.exports = router;
