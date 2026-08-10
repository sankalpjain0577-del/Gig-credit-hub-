# GigScore

Alternative credit scoring platform for gig workers and freelancers. Turns UPI
transaction activity, platform earnings frequency, bill-payment history, and
wallet retention into a transparent, explainable 300–850 credit score — with
an instant micro-credit eligibility engine and a lender risk console.

```
gigscore/
├── frontend/   Next.js 14 (App Router) + Tailwind CSS + Framer Motion + Recharts
└── backend/    Node.js + Express scoring engine and API
```

## Quick start

Open two terminals.

### 1. Backend (port 4000)

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # nodemon, or `npm start` for plain node
```

### 2. Frontend (port 3000)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Visit `http://localhost:3000`. API calls from the frontend are proxied to the
backend via a Next.js rewrite (see `frontend/next.config.js`), so no CORS
configuration is needed in development.

## Pages

| Route         | Description                                                             |
| ------------- | ------------------------------------------------------------------------ |
| `/`           | Landing page with the live interactive score preview widget             |
| `/dashboard`  | Worker dashboard — score gauge, metric cards, platform links, loan terminal |
| `/simulator`  | Scoring engine simulator — real-time recalculation as inputs change     |
| `/lender`     | Lender risk console — heatmap, applicant queue, CSV export, decisions   |

## API

| Method | Route                                | Description                                  |
| ------ | ------------------------------------- | --------------------------------------------- |
| POST   | `/api/score/calculate`               | Runs the weighted scoring engine on raw inputs |
| POST   | `/api/score/loan-eligibility`        | Computes limit, APR, and EMI for a score       |
| GET    | `/api/user/metrics`                  | Mock worker profile, history, and credentials  |
| GET    | `/api/user/platforms`                | Catalog of linkable gig platforms              |
| POST   | `/api/loan/apply`                    | Simulates an instant credit decision           |
| GET    | `/api/loan/applications`             | In-memory ledger of simulated applications     |
| GET    | `/api/lender/applicants`             | Applicant risk pool                            |
| POST   | `/api/lender/applicants/:id/decision`| Approve / send to review / decline             |
| GET    | `/api/lender/heatmap`                | Score-band × platform risk matrix              |
| GET    | `/api/lender/export`                 | Downloads a CSV risk report                    |

## Scoring model

Implemented in `backend/src/engine/scoringEngine.js`. Five weighted signal
families combine into the composite score:

- **Earnings Stability** (28%) — average monthly earnings + 6-month volatility
- **UPI Transaction Consistency** (22%) — monthly frequency + active streak
- **Platform Tenure & Diversification** (15%) — working duration + platform count
- **Bill Payment History** (20%) — on-time percentage + bills tracked
- **Wallet Retention** (15%) — average balance as a % of monthly earnings

Each sub-metric is normalized to 0–100, weighted, then mapped onto the
300–850 range. The same engine powers both `/dashboard` (real profile) and
`/simulator` (user-tunable inputs).
