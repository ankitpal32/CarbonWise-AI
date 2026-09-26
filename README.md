# CarbonWise AI 🌿

<<<<<<< HEAD
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22A866)](https://recharts.org/)
[![Deployment](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**CarbonWise AI** is a completely frictionless, zero-login sustainability web app designed to help individuals calculate, understand, and reduce their daily carbon footprint ($CO_2e$).

No signups. No passwords. No email collections. No user tracking databases. Everything lives directly inside your browser with complete local data ownership.

---

## ⚡ Frictionless User Flow

```
OPEN WEBSITE (No Login, No Account)
        ↓
Welcome & "Use My Location" (Optional & Non-Blocking)
        ↓
Browser Geolocation & Local Telemetry (Weather + Air Quality)
        ↓
Daily Carbon Calculator (Transport, Electricity, Food, Packaging)
        ↓
Location-First Dashboard & Analytics
        ↓
Targeted Reduction Planner (Identifies largest contributor & action swaps)
        ↓
Personal Goals & Eco Challenges (Build streaks & unlock badges)
        ↓
AI Sustainability Coach (Secure Gemini Serverless Integration)
        ↓
Export / Import Local Backups (JSON & CSV)
=======
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
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
```

---

<<<<<<< HEAD
## ✨ Features

- **Zero-Login Experience** — Jump straight into tracking with zero barrier to entry. No account or database required.
- **Location-First Intelligence** — One-click browser geolocation detects your city, local weather, and AQI for atmospheric context.
- **Resilient Fallback** — Location is never mandatory. If denied or unavailable, the app immediately provides standard regional estimates.
- **Daily Footprint Calculator** — 4-step calculator assessing transportation, electricity, meals, and packaging with instant validation and transparent mathematical formulas ($E = \text{Activity} \times \text{Factor}$).
- **Targeted Reduction Planner** — Automatically detects your largest emission category and gives prioritized action steps that connect to challenges.
- **Personal Goal Tracker** — Set custom reduction targets (e.g. -15% daily footprint) and track progress visually.
- **Gamification & Daily Streaks** — Active streak counter, eco challenges, and progressive achievement badges (*Green Beginner* $\to$ *Eco Warrior* $\to$ *Sustainability Champion*).
- **Secure Production-Grade Gemini AI Coach** — Server-side `/api/coach` proxy with payload sanitization, bounded exponential backoff retries, structured JSON schema outputs, and zero client secret exposure.
- **Complete Data Portability** — Export your complete footprint history and progress to JSON and CSV spreadsheets, and import backups anytime under Settings.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 CarbonWise AI (React Frontend)              │
│  - LocationHero  - Calculator  - Dashboard & Reduction Plan │
│  - GoalTracker   - Challenges  - Settings (Export/Import)   │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       (Local Storage)                 (POST /api/coach)
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│  Browser Local Storage      │ │  Serverless API (/api/coach)│
│  - Versioned schema (v1)    │ │  - Server GEMINI_API_KEY    │
│  - Daily history & goals    │ │  - Request schema validation│
│  - Factor versioning        │ │  - Bounded retry (429/503)  │
│  - Streaks, points, badges  │ │  - Structured JSON output   │
└─────────────────────────────┘ └──────────────┬──────────────┘
                                               │
                                ┌──────────────▼──────────────┐
                                │   Google Gemini 1.5 / 2.0   │
                                └─────────────────────────────┘
```

---

## 📊 Carbon Calculation Methodology & Benchmarks

CarbonWise AI calculates carbon emissions following the **GHG Protocol Activity-Data $\times$ Emission-Factor** methodology:

$$\text{Estimated Emissions } (kg\ CO_2e) = \text{Activity Data } \times \text{Emission Factor}$$

| Category | Option | Activity Basis | Emission Factor | Daily Est. ($kg\ CO_2e$) | Primary Benchmark & Source |
|---|---|---|---|---|---|
| **Transportation** | Car (Solo) | 25 km/day | 0.184 kg CO₂e/km | 4.60 | UK DEFRA / DESNZ (2024) - Compact Petrol Car |
| | Bus (Transit) | 20 km/day | 0.085 kg CO₂e/pass-km | 1.70 | UK DEFRA / DESNZ (2024) - Local Transit Bus |
| | Train / Metro | 20 km/day | 0.050 kg CO₂e/pass-km | 1.00 | UK DEFRA / India Metro Benchmark |
| | Bicycle | 10 km/day | 0.010 kg CO₂e/km | 0.10 | European Cyclists' Federation (ECF) |
| | Walking | 5 km/day | 0.000 kg CO₂e/km | 0.00 | Active human mobility |
| **Electricity** | Low | 2.10 kWh/day | 0.713 kg CO₂e/kWh | 1.50 | **Central Electricity Authority (CEA India v19)** |
| | Medium | 4.21 kWh/day | 0.713 kg CO₂e/kWh | 3.00 | **Central Electricity Authority (CEA India v19)** |
| | High | 8.42 kWh/day | 0.713 kg CO₂e/kWh | 6.00 | **Central Electricity Authority (CEA India v19)** |
| **Diet & Meals** | Vegetarian | 1 daily intake | 1.500 kg CO₂e/day | 1.50 | Poore & Nemecek, Science (2018/2023) |
| | Mixed | 1 daily intake | 3.200 kg CO₂e/day | 3.20 | Global Dietary LCA Average |
| | Non-Vegetarian | 1 daily intake | 5.000 kg CO₂e/day | 5.00 | High-meat dietary pattern LCA |
| **Packaging / Plastic**| Low | 0.05 kg/day | 6.000 kg CO₂e/kg | 0.30 | PlasticsEurope / UNEP LCA Working Group |
| | Medium | 0.15 kg/day | 6.000 kg CO₂e/kg | 0.90 | PlasticsEurope / UNEP LCA Working Group |
| | High | 0.30 kg/day | 6.000 kg CO₂e/kg | 1.80 | PlasticsEurope / UNEP LCA Working Group |

*Impact Ratings: Low ($\le 5\text{ kg}$), Moderate ($5 - 9\text{ kg}$), High ($9 - 13\text{ kg}$), Very High ($> 13\text{ kg}$).*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CarbonWise-AI.git
cd CarbonWise-AI

# Install dependencies
npm install
```

### Environment Configuration

Copy the sample environment file:

```bash
cp .env.example .env
```

Configure your server secrets in `.env`:

```env
# Server-side Gemini API key (Used exclusively by /api/coach and local Vite dev proxy)
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Override Gemini Model (default: gemini-3.8-flash)
# GEMINI_MODEL=gemini-3.8-flash

# Optional Client Config (OpenWeatherMap)
# VITE_OPENWEATHER_API_KEY=
```

> **Security Guarantee:** `GEMINI_API_KEY` is strictly a server-side secret and is never prefixed with `VITE_`. It is never bundled into client JavaScript. If omitted or offline, CarbonWise AI automatically falls back to its deterministic offline rule engine.

### Running Locally

```bash
# Start Vite development server (includes local /api/coach serverless proxy)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛠️ Validation & Testing Suite

```bash
# Run automated comprehensive test suite (Registry, Calculations, Security, Storage, Coach Proxy)
node test-audit.mjs

# Run ESLint validation (0 errors, 0 warnings)
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
=======
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
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
```

---

<<<<<<< HEAD
## 🚢 Production Deployment (Vercel)

CarbonWise AI is fully configured for Vercel deployment with zero additional backend servers:

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variable in your Vercel Project Settings:
   - Key: `GEMINI_API_KEY`
   - Value: `<your_gemini_api_key>`
   - Target Environments: `Production`, `Preview`, `Development`
4. Deploy! Vercel will automatically build the static React frontend and deploy `/api/coach` as a secure Node.js serverless function.

---

## 🔒 Security & Privacy

- **Zero Accounts / Passwords:** No email, password, authentication screens, or remote user database.
- **Client-Side Data Ownership:** All personal logs, challenges, goals, and streak metrics stay strictly within the user's browser `localStorage`.
- **Zero Client Secret Exposure:** Gemini API keys are never bundled into client JavaScript, exposed in network headers, or stored in `localStorage`.
- **Payload Validation & Sanitization:** The server proxy validates all types, bounds inputs, and enforces a strict 32KB payload ceiling.
- **Bounded Transient Retries:** Automatic exponential backoff handles rate-limiting (429) and temporary service errors (503) without infinite retry loops.
- **Offline Resilience:** External API downtime or lack of an API key never disrupts calculator workflows, charts, or streak tracking.

---

## 📄 License

MIT License — free for educational, personal, and open-source hackathon use.
=======
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
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
