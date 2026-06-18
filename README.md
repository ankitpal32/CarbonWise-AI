# CarbonWise AI 🌿

A modern, responsive web app for daily carbon footprint awareness — built for a hackathon. Calculate your daily carbon score, get personalized recommendations, complete eco challenges, earn badges, and chat with an AI Sustainability Coach. No backend, no database, no account — everything lives in your browser's Local Storage.

![tech](https://img.shields.io/badge/React-18-61DAFB) ![tech](https://img.shields.io/badge/Vite-5-646CFF) ![tech](https://img.shields.io/badge/Tailwind-3-38BDF8) ![tech](https://img.shields.io/badge/Recharts-2-22A866)

---

## Features

- **Carbon Footprint Calculator** — log transportation, electricity usage, food preference, and plastic usage to get an instant daily carbon score (kg CO₂e) and impact rating.
- **Personalized Recommendations** — specific, rule-based suggestions generated from your actual inputs, not generic tips.
- **Dashboard** — today's score, 7-day average, day-over-day delta, impact level, weekly trend chart, and category breakdown chart.
- **Eco Challenges** — No Plastic Day, Walk Instead of Drive, Energy Saver Challenge, Plant a Tree, Meat-Free Day, Buy Second-Hand. Mark complete to earn points.
- **Achievement Badges** — Green Beginner → Eco Warrior (100 pts) → Sustainability Champion (250 pts), unlocked automatically.
- **AI Sustainability Coach** — click "Get AI Advice" for personalized coaching powered by Google's Gemini API, with a smart offline fallback if no key is configured or the request fails.
- **Modern dark UI** — glassmorphism cards, green eco accent palette, a custom organic "leaf gauge" score visualization, smooth animations, fully mobile responsive.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (custom design tokens) |
| Charts | Recharts |
| Routing | React Router |
| Persistence | Browser Local Storage (no database, no backend) |
| AI Coach | Google Gemini API (`gemini-2.0-flash`), called client-side |
| Deployment target | Vercel (static SPA) |

---

## Project Structure

```
carbonwise-ai/
├── public/
│   └── leaf-icon.svg
├── src/
│   ├── components/
│   │   ├── achievements/      # BadgeCard
│   │   ├── calculator/        # CalculatorForm, OptionSelector, ResultPanel
│   │   ├── challenges/        # ChallengeCard, ChallengeProgress
│   │   ├── coach/             # AICoachPanel (Gemini integration)
│   │   ├── common/            # GlassCard, StatCard, Icons
│   │   ├── dashboard/         # LeafGauge, WeeklyTrendChart, CategoryBreakdownChart
│   │   └── layout/             # Navbar, Footer, PageLayout
│   ├── data/
│   │   └── carbonData.js      # scoring constants, rules, challenges, badges
│   ├── hooks/
│   │   ├── useCarbonData.js   # app state (history, challenges, points, badges)
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Challenges.jsx
│   │   └── About.jsx
│   ├── utils/
│   │   ├── storage.js         # Local Storage read/write helpers
│   │   └── geminiService.js   # Gemini API client + offline fallback
│   ├── App.jsx                 # routes
│   ├── main.jsx                 # entry point
│   └── index.css               # Tailwind layers + design tokens
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
├── package.json
└── .env.example
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & run locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the app
# Vite will print a local URL, typically http://localhost:5173
```

### Build for production

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build locally
```

---

## Using the AI Sustainability Coach

The coach works out of the box with **no API key required** — it falls back to smart, rule-based offline advice generated from your logged inputs.

To enable **live AI-generated coaching**:

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. In the app, log today's habits on the Dashboard, then click **Get AI Advice**.
3. Paste your key into the "Add a Gemini API key" field and save.
4. Click **Get AI Advice** again — you'll now get a live, personalized response.

Your key is stored only in your browser's Local Storage and is sent directly from your browser to Google's API. It is never sent anywhere else, and this project has no backend to intercept it.

> **Security note:** calling a third-party API directly from the browser means your key is visible in network requests from your own device. This is acceptable for a personal/hackathon demo. For a production deployment, proxy Gemini calls through a small serverless function so the key stays server-side.

---

## How the Carbon Score Works

Each daily log produces a score in kg CO₂e (carbon dioxide equivalent), summed from four categories:

| Category | Options | Approx. kg CO₂e/day |
|---|---|---|
| Transportation | Car / Bus / Train / Bicycle / Walking | 0 – 4.6 |
| Electricity | Low / Medium / High | 1.2 – 5.8 |
| Food | Vegetarian / Mixed / Non-Vegetarian | 1.5 – 5.0 |
| Plastic | Low / Medium / High | 0.3 – 1.8 |

Impact ratings:

| Score (kg CO₂e) | Rating |
|---|---|
| 0 – 5 | Low Impact |
| 5 – 9 | Moderate Impact |
| 9 – 13 | High Impact |
| 13+ | Very High Impact |

These figures are simplified, illustrative averages meant to build awareness and intuition — not certified carbon accounting. See the in-app **About** page for more detail.

---

## Deploying to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — Git + Vercel dashboard

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy — no environment variables are required.

The included `vercel.json` adds an SPA rewrite rule so client-side routes (`/dashboard`, `/challenges`, `/about`) work correctly on refresh/direct navigation.

---

## Data & Privacy

- All carbon logs, challenge completions, points, and badges are stored in `localStorage` on your device.
- There is no account system, no analytics, and no server-side storage.
- Clearing your browser's site data will reset your CarbonWise AI history.
- The only outbound network call (besides loading the page) is the optional Gemini API request, made directly from your browser if you choose to add an API key.

---

## Notes for Judges / Reviewers

- Zero backend dependencies — runs entirely as a static SPA, deployable anywhere static files are served.
- Clean component boundaries: presentational components (`common/`, `dashboard/`, etc.) are decoupled from data logic (`data/`, `utils/`, `hooks/`).
- The carbon scoring engine and recommendation rules are pure functions in `src/data/carbonData.js`, independently testable.
- The AI Coach gracefully degrades to offline advice if no key is set or the API call fails, so the feature always demos successfully even without internet access or quota.

---

Built for a hackathon. Not a substitute for certified carbon accounting tools.
