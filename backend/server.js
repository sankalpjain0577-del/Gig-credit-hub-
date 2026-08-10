require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const scoreRoutes = require("./src/routes/score");
const userRoutes = require("./src/routes/user");
const loanRoutes = require("./src/routes/loan");
const lenderRoutes = require("./src/routes/lender");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", service: "gigscore-backend" });
});

app.use("/api/score", scoreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/lender", lenderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, errors: ["Route not found"] });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, errors: ["Internal server error"] });
});

app.listen(PORT, () => {
  console.log(`🚀 GigScore backend listening on http://localhost:${PORT}`);
});

module.exports = app;
