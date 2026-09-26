# CarbonWise AI

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.10-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12.7-22A866)](https://recharts.org/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Not%20Specified-gray)](https://github.com/ankitpal32/CarbonWise-AI)

CarbonWise AI is a web application for estimating personal carbon footprints, understanding emission categories, tracking progress, and receiving practical sustainability guidance.

Built with a privacy-first, zero-login architecture, CarbonWise AI operates directly in the browser with local data persistence, transparent greenhouse gas calculation models, contextual environmental telemetry, and an AI-powered sustainability coach.

---

## Overview

### The Problem
Most personal carbon calculators require lengthy questionnaires, mandatory account creation, or vague formulas that obscure how calculations are made. Furthermore, generic eco-tips often fail to connect daily choices with real atmospheric context or an individual's highest-emitting habits.

### What CarbonWise AI Does
CarbonWise AI simplifies daily environmental awareness into a transparent, low-friction experience:
- **Quantifies daily estimated footprint** ($\text{kg CO}_2\text{e}$) across four key lifestyle levers: transportation, household electricity, diet, and packaging.
- **Provides transparent calculation formulas** based on published greenhouse gas emission factors (GHG Protocol model).
- **Fetches local environmental context** (weather and Air Quality Index) to ground daily suggestions in real-world atmospheric conditions.
- **Offers actionable reduction planning** by identifying the user's primary emissions contributor and suggesting targeted swaps.
- **Delivers AI sustainability coaching** via a secure Google Gemini serverless proxy with deterministic offline fallbacks.

### Intended Audience
CarbonWise AI is designed for individuals seeking to understand and lower their everyday carbon impact, students learning about carbon accounting, developers exploring local-first AI architectures, and hackathon reviewers evaluating functional sustainability tooling.

> **Scientific Accuracy Note:** All carbon values presented are **estimated $\text{CO}_2\text{e}$** calculated from standardized baseline activities and published emission factors. They are intended for personal education and habit awareness, not certified compliance carbon accounting.

---

## Features

### 1. Carbon Footprint Calculator
- **Transportation:** Car (solo petrol/diesel average), Bus (public transit), Train / Metro (electric rail transit), Bicycle (active commute), and Walking (zero tailpipe).
- **Electricity Usage:** Low (energy-efficient appliances, LEDs, no AC), Medium (standard household baseline), and High (sustained air conditioning / heating).
- **Diet & Meals:** Vegetarian (plant-based / lacto-vegetarian), Mixed (balanced flexitarian), and Non-Vegetarian (meat-forward meals).
- **Packaging & Single-Use Plastic:** Low (reusables, minimal single-use packaging), Medium (standard grocery packaging), and High (frequent disposable containers and bottles).
- **Instant Ratings:** Categorizes total estimated daily footprint into **Low Impact** ($\le 5.0\text{ kg}$), **Moderate Impact** ($5.0 - 9.0\text{ kg}$), **High Impact** ($9.0 - 13.0\text{ kg}$), and **Very High Impact** ($> 13.0\text{ kg CO}_2\text{e}$).

### 2. Dashboard & Analytics
- **Summary Metrics:** Today's estimated footprint, 7-day rolling average, day-over-day delta, and logging streak counter.
- **Visual Leaf Gauge:** Dynamic SVG indicator reflecting current impact category and progress.
- **Weekly Trend Chart:** Interactive Recharts line chart illustrating daily fluctuations over the last 7 recorded entries.
- **Category Breakdown Chart:** Recharts bar visualization showing the proportional distribution across transport, electricity, food, and packaging.

### 3. Targeted Reduction Planner
- Automatically detects the user's largest daily emissions contributor.
- Generates prioritized, high-impact behavioral swaps tailored to that specific category.
- Directly links recommended reduction actions to daily eco challenges.

### 4. Sustainability Challenges & Badges
- **Real-World Challenges:** Daily action tasks including *No Plastic Day* (20 pts), *Walk, Bike, or Transit* (15 pts), *Energy Saver Day* (15 pts), *Plant or Tend Greens* (30 pts), *Plant-Forward Meals* (15 pts), and *Reusable or Pre-Owned* (10 pts).
- **Milestone Badges:** Progressive tier unlocks based on accumulated challenge points:
  - 🌱 **Green Beginner** (0+ points)
  - 🌿 **Eco Warrior** (100+ points)
  - 🌳 **Sustainability Champion** (200+ points)

### 5. AI Sustainability Coach (Google Gemini)
- Server-side proxy (`/api/coach`) communicating with Google Gemini (`gemini-3.8-flash` with multi-model fallback).
- Evaluates the user's sanitized footprint breakdown, local weather, air quality, streak, and reduction goals.
- Generates structured JSON advice consisting of a summary, highest-leverage category, concrete reduction swaps, a daily mini-challenge, and encouragement.
- **Deterministic Offline Rule Engine:** Automatically provides rule-based recommendations if offline, unconfigured, or rate-limited, ensuring the interface never fails.

### 6. Weather & Air Quality Context
- Displays ambient temperature, weather conditions, humidity, and wind speed.
- Displays Air Quality Index (AQI 1–5 scale: Good, Fair, Moderate, Poor, Very Poor) along with particulate data ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{CO}$, $\text{NO}_2$, $\text{O}_3$).
- Uses **Open-Meteo** as the primary keyless, public weather/AQI provider, with optional **OpenWeatherMap** integration.

### 7. Optional Location
- Browser Geolocation with reverse geocoding via BigDataCloud.
- **Completely Optional:** If location access is denied or unavailable, the application defaults gracefully to **Kolkata, West Bengal, India** coordinates without interrupting workflows.
- No continuous location tracking; coordinates are requested on-demand and cached in session storage.

### 8. Data Portability & Settings
- Export entire carbon history and challenge logs as structured **JSON** or spreadsheet-compatible **CSV**.
- Restore data from previous JSON backups.
- One-click local data reset.

---

## Product Flow

```text
               ┌───────────────────────────────┐
               │        Open CarbonWise        │
               │   (No Account / No Login)     │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    Optional Location Prompt   │
               │ (Fallback: Kolkata Default)   │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    Environmental Telemetry    │
               │    (Weather & AQI Context)    │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │   Carbon Footprint Calculator │
               │ (Transport, Energy, Food, PKG)│
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │  Estimated CO₂e & Dashboard   │
               │   (Leaf Gauge, Charts, Delta) │
               └───────────────┬───────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
┌────────▼──────────────┐                 ┌──────────▼────────────┐
│   Reduction Planner   │                 │ AI Sustainability     │
│  & Daily Challenges   │                 │ Coach (/api/coach)    │
└────────┬──────────────┘                 └──────────┬────────────┘
         │                                           │
         └─────────────────────┬─────────────────────┘
                               │
               ┌───────────────▼───────────────┐
               │   Browser Local Storage       │
               │ (JSON / CSV Data Export)      │
               └───────────────────────────────┘
```

### Graceful Degradation Guarantee
If external dependencies encounter issues (e.g., location permission denied, weather API timeout, or Gemini rate limits), CarbonWise AI handles the failure silently. The calculation engine, dashboard charts, challenge progress, and offline rule-based coaching remain completely usable.

---

## How CarbonWise Calculates

CarbonWise AI follows the standard **GHG Protocol Activity Data $\times$ Emission Factor** methodology:

$$\text{Estimated Daily Emissions } (\text{kg CO}_2\text{e}) = \text{Activity Data } \times \text{Emission Factor}$$

$$\text{Total Daily Estimated Footprint} = E_{\text{transport}} + E_{\text{electricity}} + E_{\text{food}} + E_{\text{plastic}}$$

### Emission Factor Reference Table

| Category | Selection | Assumed Activity | Emission Factor | Estimated Daily $\text{CO}_2\text{e}$ | Documented Primary Source |
|---|---|---|---|---|---|
| **Transportation** | Car (Solo) | $25\text{ km/day}$ | $0.184\text{ kg CO}_2\text{e/km}$ | $4.60\text{ kg}$ | UK DEFRA / DESNZ 2024 & ARAI Small-to-Midsize Petrol Car |
| | Bus (Transit) | $20\text{ km/day}$ | $0.085\text{ kg CO}_2\text{e/pass-km}$ | $1.70\text{ kg}$ | Central Road Research Institute (CRRI) / UK DEFRA Local Bus |
| | Train / Metro | $20\text{ km/day}$ | $0.050\text{ kg CO}_2\text{e/pass-km}$ | $1.00\text{ kg}$ | Delhi Metro Rail Corp (DMRC) & Indian Railways GHG Baseline |
| | Bicycle | $10\text{ km/day}$ | $0.010\text{ kg CO}_2\text{e/km}$ | $0.10\text{ kg}$ | European Cyclists' Federation (ECF) Lifecycle Assessment |
| | Walking | $5\text{ km/day}$ | $0.000\text{ kg CO}_2\text{e/km}$ | $0.00\text{ kg}$ | Human mobility baseline (zero anthropogenic emissions) |
| **Electricity** | Low | $1.68\text{ kWh/day}$ | $0.713\text{ kg CO}_2\text{e/kWh}$ | $1.20\text{ kg}$ | Central Electricity Authority (CEA) of India Baseline v19 |
| | Medium | $4.21\text{ kWh/day}$ | $0.713\text{ kg CO}_2\text{e/kWh}$ | $3.00\text{ kg}$ | Central Electricity Authority (CEA) of India Baseline v19 |
| | High | $8.13\text{ kWh/day}$ | $0.713\text{ kg CO}_2\text{e/kWh}$ | $5.80\text{ kg}$ | Central Electricity Authority (CEA) of India Baseline v19 |
| **Diet & Meals** | Vegetarian | $1\text{ day of meals}$ | $1.500\text{ kg CO}_2\text{e/day}$ | $1.50\text{ kg}$ | Poore & Nemecek (*Science* 2018), ICMR-NIN Dietary LCA |
| | Mixed | $1\text{ day of meals}$ | $3.200\text{ kg CO}_2\text{e/day}$ | $3.20\text{ kg}$ | Poore & Nemecek (*Science* 2018), Global Flexitarian LCA |
| | Non-Vegetarian | $1\text{ day of meals}$ | $5.000\text{ kg CO}_2\text{e/day}$ | $5.00\text{ kg}$ | Scarborough et al. (*Nature Food* 2023), High-Meat Pattern |
| **Packaging / Plastic** | Low | $1\text{ day packaging}$ | $0.300\text{ kg CO}_2\text{e/day}$ | $0.30\text{ kg}$ | PlasticsEurope Eco-Profiles & UNEP Reusables LCA |
| | Medium | $1\text{ day packaging}$ | $0.900\text{ kg CO}_2\text{e/day}$ | $0.90\text{ kg}$ | PlasticsEurope / Franklin Associates Lifecycle Inventory |
| | High | $1\text{ day packaging}$ | $1.800\text{ kg CO}_2\text{e/day}$ | $1.80\text{ kg}$ | UNEP Single-Use Plastics and Alternatives LCA Study |

### Daily Impact Classification

| Daily Total ($\text{kg CO}_2\text{e}$) | Impact Classification | Description |
|---|---|---|
| $0.0 - 5.0$ | **Low Impact** | Low carbon intensity relative to standard urban baselines. |
| $5.1 - 9.0$ | **Moderate Impact** | Balanced lifestyle footprint with practical reduction potential. |
| $9.1 - 13.0$ | **High Impact** | Elevated footprint driven by car commuting, heavy cooling, or meat consumption. |
| $> 13.0$ | **Very High Impact** | High carbon intensity; prioritized habit swaps can produce major reductions. |

---

## AI Architecture

The AI Sustainability Coach utilizes a secure serverless proxy architecture:

```text
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Browser)                    │
│   AICoachPanel -> fetchCoachAdvice() -> POST /api/coach     │
└──────────────┬───────────────────────────────▲──────────────┘
               │ (Sanitized Payload, No Keys)   │ (Structured JSON)
┌──────────────▼───────────────────────────────┴──────────────┐
│          Serverless Proxy (/api/coach - Node.js)            │
│  - Reads GEMINI_API_KEY from secure server environment      │
│  - Enforces IP sliding-window rate limiting (25 req / 10m)  │
│  - Validates payload structure (< 32KB payload boundary)    │
│  - Candidate model fallback hierarchy (gemini-3.8-flash ->  │
│    gemini-flash-latest -> gemini-3.7-flash)                 │
│  - Bounded exponential backoff retry for transient 429/503  │
└──────────────┬───────────────────────────────▲──────────────┘
               │ (Prompt + JSON Schema)        │ (JSON Candidate Text)
┌──────────────▼───────────────────────────────┴──────────────┐
│                    Google Gemini API                        │
│   https://generativelanguage.googleapis.com/v1beta/models   │
└─────────────────────────────────────────────────────────────┘
```

### Security & Privacy Rules
- **Server-Side Secret Isolation:** The `GEMINI_API_KEY` is kept server-side and is never exposed to the browser.
- **Zero Client-Side AI Keys:** `VITE_GEMINI_API_KEY` is not used. Sensitive Gemini credentials are kept exclusively on the server / serverless function.
- **Input Sanitization:** Client payloads are stripped of excess data, numeric values are clamped, and strings are length-limited before reaching the Gemini prompt.

---

## No-Login Architecture

CarbonWise AI does not require an account. User-side application data is stored locally where supported, eliminating the need for a traditional user-account backend.

- **Local Storage Schema:** Daily footprint logs, active streaks, challenge completions, point totals, and custom goals are stored in the browser's `localStorage` (`carbonwise_data_v1`).
- **No Remote User Profiles:** No email addresses, passwords, phone numbers, or user identity records are collected.
- **External Telemetry:** External services (reverse geocoding, weather, AQI, and Gemini) receive only the minimal coordinates or anonymous activity totals necessary to fulfill the immediate request.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18.3.1 | Component-based user interface |
| **Build Tool** | Vite 5.4.2 | Fast development server and production bundler |
| **Routing** | React Router DOM 6.26.2 | Client-side page navigation |
| **Styling** | Tailwind CSS 3.4.10 + PostCSS | Utility-first responsive design tokens |
| **Data Visualization** | Recharts 2.12.7 | Interactive trend and breakdown charts |
| **Serverless AI Proxy** | Node.js Serverless Function (`/api/coach`) | Server-side Gemini API proxy with rate limiting |
| **AI Integration** | Google Gemini API (`gemini-3.8-flash`) | Contextual sustainability coaching |
| **Persistence** | Browser `localStorage` / `sessionStorage` | Zero-login client-side storage |
| **Weather Telemetry** | Open-Meteo API / OpenWeatherMap | Local temperature, humidity, wind, and conditions |
| **Air Quality Telemetry** | Open-Meteo Air Quality / OpenWeatherMap | Local AQI, $\text{PM}_{2.5}$, $\text{PM}_{10}$, and gas metrics |
| **Geocoding** | BigDataCloud Reverse Geocode Client | Coordinate-to-city resolution |
| **Deployment Platform** | Vercel | Static SPA hosting + Serverless API execution |

---

## Project Structure

```text
CarbonWise-AI/
├── api/
│   └── coach.js                    # Serverless Gemini proxy with rate limiting & sanitization
├── public/
│   └── leaf-icon.svg               # Application brand icon
├── src/
│   ├── components/
│   │   ├── achievements/
│   │   │   └── BadgeCard.jsx       # Achievement badge visualizer
│   │   ├── calculator/
│   │   │   ├── CalculatorForm.jsx  # 4-step carbon footprint form
│   │   │   ├── OptionSelector.jsx  # Visual category option selector
│   │   │   └── ResultPanel.jsx     # Calculation summary & breakdown
│   │   ├── challenges/
│   │   │   ├── ChallengeCard.jsx   # Individual eco challenge item
│   │   │   └── ChallengeProgress.jsx # Points, tier progress, and streak tracker
│   │   ├── coach/
│   │   │   └── AICoachPanel.jsx    # AI Sustainability Coach modal dialogue
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx   # React component error boundary
│   │   │   ├── GlassCard.jsx       # Glassmorphism container wrapper
│   │   │   ├── Icons.jsx           # SVG icon registry
│   │   │   └── StatCard.jsx        # Metric display card
│   │   ├── dashboard/
│   │   │   ├── CategoryBreakdownChart.jsx # Recharts category distribution
│   │   │   ├── EnvironmentPanel.jsx # Weather & AQI atmospheric cards
│   │   │   ├── GoalTracker.jsx     # Custom footprint reduction target tracker
│   │   │   ├── LeafGauge.jsx       # SVG organic leaf score gauge
│   │   │   ├── ReductionPlanner.jsx# Targeted category reduction suggestions
│   │   │   └── WeeklyTrendChart.jsx# 7-day historical trend chart
│   │   ├── home/
│   │   │   └── LocationHero.jsx    # Hero section with location prompt & quick telemetry
│   │   └── layout/
│   │       ├── Footer.jsx          # Footer with methodology & data links
│   │       ├── Navbar.jsx          # Navigation header
│   │       └── PageLayout.jsx      # Global page container
│   ├── data/
│   │   ├── carbonData.js           # Scoring logic, options, rules, challenges, badges
│   │   └── emissionFactors.js      # Central GHG emission factor registry with sources
│   ├── hooks/
│   │   ├── useCarbonData.js        # Core carbon state, history, goals, streaks, and export
│   │   ├── useEnvData.js           # Environmental hook (location, weather, AQI)
│   │   └── useLocalStorage.js     # React hook for browser localStorage synchronization
│   ├── pages/
│   │   ├── About.jsx               # Scientific methodology, factors, and data reset
│   │   ├── Challenges.jsx          # Eco challenges, point tracking, and badge unlocks
│   │   ├── Dashboard.jsx           # Footprint logging, trends, charts, and reduction plan
│   │   ├── Home.jsx                # Landing hero, value proposition, and feature highlights
│   │   └── Settings.jsx            # Data export (JSON/CSV), backup restore, location settings
│   ├── services/
│   │   ├── airQualityService.js    # AQI telemetry fetching (Open-Meteo / OpenWeatherMap)
│   │   ├── geminiRecommendationService.js # Environmental recommendation generator
│   │   ├── locationService.js      # Geolocation & BigDataCloud reverse geocoding
│   │   └── weatherService.js       # Weather telemetry fetching (Open-Meteo / OpenWeatherMap)
│   ├── utils/
│   │   ├── geminiService.js        # Client coach proxy caller & offline fallback rules
│   │   └── storage.js              # Local storage schema management, export/import
│   ├── App.jsx                     # Route definitions
│   ├── index.css                   # Tailwind layers & custom design tokens
│   └── main.jsx                    # React DOM root entry
├── .env.example                    # Template environment variables
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies & npm scripts
├── tailwind.config.js              # Tailwind styling configuration
├── vercel.json                     # Vercel deployment rewrite rules
└── vite.config.js                  # Vite configuration & dev API server proxy
```

---

## Getting Started

### Prerequisites
- **Node.js**: `18.0.0` or higher
- **npm**: `9.0.0` or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ankitpal32/CarbonWise-AI.git

# 2. Navigate to the project directory
cd CarbonWise-AI

# 3. Install dependencies
npm install

# 4. Copy sample environment file
cp .env.example .env
```

### Running Locally

```bash
# Start the Vite development server (includes local /api/coach proxy)
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173
```

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the local Vite development server with API proxy |
| `npm run build` | Compiles the production build into the `dist/` directory |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint across the codebase |

---

## Environment Variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **Server-side only** | Optional | Google Gemini API key used by `/api/coach` for live AI coaching. If omitted, the app uses its offline rule engine. |
| `GEMINI_MODEL` | **Server-side only** | Optional | Overrides primary Gemini model (default: `gemini-3.8-flash`). |
| `VITE_OPENWEATHER_API_KEY` | **Client-side** | Optional | OpenWeatherMap key. If omitted, the app uses keyless Open-Meteo telemetry automatically. |

> **Security Notice:** Never commit `.env` or any real API keys to version control. `GEMINI_API_KEY` must never be given a `VITE_` prefix, as Vite exposes `VITE_*` variables directly to client-side bundles.

---

## Deployment

CarbonWise AI is designed for deployment on **Vercel** with static frontend hosting and a serverless API function:

1. **Push your code** to GitHub or GitLab.
2. **Import the repository** in the [Vercel Dashboard](https://vercel.com).
3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Configure Environment Variables** in Vercel Project Settings:
   - `GEMINI_API_KEY`: `<your_gemini_api_key>` (Production, Preview, Development)
   - `GEMINI_MODEL`: `gemini-3.8-flash` (Optional)
5. **Deploy:** Click **Deploy**. Vercel will build the React SPA and deploy `/api/coach` as a Node.js serverless function.
6. **Verification:**
   - Test frontend navigation (`/`, `/dashboard`, `/challenges`, `/about`, `/settings`).
   - Open the Dashboard and click **Get AI Advice** to confirm `/api/coach` executes successfully.

---

## Error & Fallback Behavior

| Event / Failure | System Response | User Experience Impact |
|---|---|---|
| **Location Permission Denied** | Defaults to Kolkata, West Bengal coordinates ($22.5726^\circ\text{N}, 88.3639^\circ\text{E}$). | None. Calculator and weather/AQI cards load regional estimates without error alerts. |
| **Weather / AQI Provider Downtime** | Weather/AQI cards display safe empty states; environmental tips fall back to general guidance. | Minimal. Calculation, charts, streaks, and challenges continue working. |
| **No Gemini API Key Configured** | Serverless function `/api/coach` returns deterministic rule-based advice (`source: 'offline-rule-engine'`). | None. AI Coach panel delivers tailored suggestions without throwing errors. |
| **Gemini Rate Limit (429) or Service Error (503)** | Bounded retry is attempted once; if unsuccessful, returns structured offline advice with a non-blocking notice. | Minimal. User receives actionable swaps immediately. |
| **Offline Browser (No Internet)** | App runs from browser memory and `localStorage`. | Core calculator, historical charts, reduction planner, and offline coach work seamlessly. |
| **Empty History on First Visit** | Dashboard displays clean initial state with zero-log prompts and default regional baseline. | Smooth onboarding. |

---

## Accessibility

- **Semantic Structure:** Structured HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`) with a logical single `<h1>` heading hierarchy.
- **Keyboard Usability:** Interactive elements, selectors, dialogs, and buttons support standard `Tab`, `Enter`, `Space`, and `Escape` keyboard interactions.
- **Accessible Focus:** Visible focus rings for interactive elements.
- **Contrast & Hierarchy:** Dark theme palette utilizing slate and green contrast tiers (`#0e1713` background with high-contrast text tokens `#edf5ee` and `#a7cbb0`).
- **Responsive Layout:** Fluid layout adapting across mobile smartphones ($360\text{px}+$ viewport), tablets, laptops, and wide desktop screens.

---

## Privacy & Data Handling

- **Local Data Storage:** All daily footprint logs, completed challenges, points, and streak counts reside in the user's browser `localStorage`.
- **No User Database:** CarbonWise AI has no user registration, password database, or remote profile tracking.
- **Data Deletion & Export:** Users can export their complete data history to JSON/CSV or delete all local records with a single click in Settings or About.
- **Telemetry Boundaries:** When weather or AQI data is retrieved, only geographical coordinates are sent to the public telemetry providers. When the AI Coach is invoked, only the anonymized numeric category totals are sent to `/api/coach`.

---

## Limitations

- **Estimation Model:** Calculations are personal estimates based on average operational benchmarks, not audited lifecycle assessments or certified carbon offsets.
- **Standardized Distance & Activity Baselines:** Category selections use representative daily averages (e.g., $25\text{ km}$ average car commute, $1.7 - 8.1\text{ kWh}$ electricity tiers).
- **Regional Emission Factors:** Grid electricity factors reflect the Indian Central Electricity Authority national grid average ($0.713\text{ kg CO}_2\text{e/kWh}$). Other regional grids may have higher or lower carbon intensities.
- **Third-Party Service Availability:** Live weather, air quality, and AI coaching rely on third-party API availability and network access.

---

## Roadmap

- [ ] **Custom Activity Inputs:** Allow users to enter exact daily commute distances (km) and specific electricity meter readings (kWh).
- [ ] **Expanded Regional Grid Presets:** Support one-click selection of regional grid emission factors (e.g., US EPA eGRID, European EEA, UK DESNZ).
- [ ] **Multi-Language Localization:** Internationalization support for major global languages.
- [ ] **Offline PWA Installation:** Progressive Web App manifest and service worker for complete standalone offline mobile use.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---

## License

License: Not specified.

---

## Author

**Ankit Pal**  
BCA — Supreme Knowledge Foundation Group of Institutions  
Maulana Abul Kalam Azad University of Technology (MAKAUT), India  
GitHub: [@ankitpal32](https://github.com/ankitpal32)  
Repository: [https://github.com/ankitpal32/CarbonWise-AI](https://github.com/ankitpal32/CarbonWise-AI)
