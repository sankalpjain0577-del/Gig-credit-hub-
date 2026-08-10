const { calculateGigScore } = require("../engine/scoringEngine");

const PLATFORMS = [
  { id: "swiggy", name: "Swiggy", category: "Food Delivery", color: "#FC8019" },
  { id: "zomato", name: "Zomato", category: "Food Delivery", color: "#E23744" },
  { id: "uber", name: "Uber", category: "Ride Hailing", color: "#00C2CB" },
  { id: "ola", name: "Ola", category: "Ride Hailing", color: "#00FF87" },
  { id: "urbancompany", name: "Urban Company", category: "Home Services", color: "#7B61FF" },
  { id: "upwork", name: "Upwork", category: "Freelance", color: "#14A800" },
];

const baseWorker = {
  id: "wrk_9f21ac",
  name: "Ananya Rao",
  city: "Jaipur, Rajasthan",
  primaryPlatform: "uber",
  activePlatforms: ["uber", "swiggy", "urbancompany"],
  workingDurationMonths: 27,
  avgMonthlyEarningsInr: 34500,
  monthlyEarningsHistory: [28500, 31200, 33800, 32100, 35900, 34500],
  monthlyUpiTransactionCount: 86,
  upiActiveStreakMonths: 14,
  onTimePaymentPercentage: 91,
  monthlyBillCount: 6,
  avgWalletBalanceInr: 12800,
  verifiedCredentials: [
    { type: "PAN", verified: true },
    { type: "Aadhaar", verified: true },
    { type: "Bank Account", verified: true },
    { type: "Platform ID (Uber)", verified: true },
  ],
};

function buildScoreHistory() {
  // 6 monthly snapshots trending upward with realistic noise
  const trend = [612, 634, 651, 668, 705, 742];
  return trend.map((score, i) => ({
    month: new Date(2026, i + 2, 1).toLocaleString("en-IN", { month: "short" }),
    score,
  }));
}

function getWorkerProfile() {
  const score = calculateGigScore(baseWorker);
  return {
    ...baseWorker,
    platformsDetail: PLATFORMS.filter((p) => baseWorker.activePlatforms.includes(p.id)),
    scoreHistory: buildScoreHistory(),
    currentScore: score,
  };
}

// Mock lender-side applicant pool for the Risk Assessment view
const LOAN_APPLICANTS = [
  {
    id: "app_001",
    name: "Ravi Kumar",
    platform: "Swiggy",
    city: "Bengaluru",
    score: 782,
    requestedAmountInr: 25000,
    tenureMonths: 6,
  },
  {
    id: "app_002",
    name: "Priya Sharma",
    platform: "Zomato",
    city: "Pune",
    score: 705,
    requestedAmountInr: 40000,
    tenureMonths: 12,
  },
  {
    id: "app_003",
    name: "Mohammed Faisal",
    platform: "Uber",
    city: "Hyderabad",
    score: 611,
    requestedAmountInr: 60000,
    tenureMonths: 9,
  },
  {
    id: "app_004",
    name: "Sneha Iyer",
    platform: "Urban Company",
    city: "Chennai",
    score: 548,
    requestedAmountInr: 15000,
    tenureMonths: 3,
  },
  {
    id: "app_005",
    name: "Arjun Mehta",
    platform: "Upwork",
    city: "Jaipur",
    score: 468,
    requestedAmountInr: 80000,
    tenureMonths: 18,
  },
  {
    id: "app_006",
    name: "Kavya Reddy",
    platform: "Ola",
    city: "Delhi NCR",
    score: 826,
    requestedAmountInr: 100000,
    tenureMonths: 24,
  },
  {
    id: "app_007",
    name: "Deepak Nair",
    platform: "Swiggy",
    city: "Kochi",
    score: 592,
    requestedAmountInr: 22000,
    tenureMonths: 6,
  },
  {
    id: "app_008",
    name: "Fatima Sheikh",
    platform: "Uber",
    city: "Mumbai",
    score: 731,
    requestedAmountInr: 35000,
    tenureMonths: 10,
  },
];

module.exports = { PLATFORMS, baseWorker, getWorkerProfile, LOAN_APPLICANTS };
