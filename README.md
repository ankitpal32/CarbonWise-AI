# CarbonWise AI 🌿

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
```

---

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
```

---

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
