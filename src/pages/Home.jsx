import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import GlassCard from '../components/common/GlassCard'
import {
  IconLeaf,
  IconCar,
  IconBolt,
  IconPlate,
  IconBottle,
  IconSparkles,
  IconTarget,
  IconAward,
  IconRobot,
  IconShieldCheck,
  IconChevronRight,
  IconArrowRight,
  IconCheck,
} from '../components/common/Icons'
import { useEnvData } from '../hooks/useEnvData'
import { useCarbonData } from '../hooks/useCarbonData'
import { CHALLENGES } from '../data/carbonData'

export default function Home() {
  const navigate = useNavigate()
  const [locRequested, setLocRequested] = useState(false)
  const { weather, airQuality, locationInfo, loading, locationStatus, requestLocation } = useEnvData({ autoRequest: false })
  const { today, history } = useCarbonData()

  const handleUseLocation = async () => {
    setLocRequested(true)
    await requestLocation()
  }

  const isDefaultLocation = !locationInfo || locationInfo.isDefault || locationStatus === 'fallback' || locationStatus === 'denied'
  const isRequesting = locationStatus === 'requesting'

  // Representative challenges from the system
  const featuredChallenges = CHALLENGES.slice(0, 4)

  return (
    <PageLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 bg-canopy-glow pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-bark-300 backdrop-blur-md">
            <IconLeaf className="w-3.5 h-3.5 text-moss-400" />
            <span>Private · Local-First · No Account Required</span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-bark-100 sm:text-5xl lg:text-6xl max-w-4xl mx-auto">
            Understand your footprint.{' '}
            <span className="text-gradient-moss block mt-1">Make your next step count.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-bark-300 max-w-2xl mx-auto leading-relaxed">
            Estimate your daily carbon emissions across travel, electricity, diet, and packaging.
            Get practical reduction steps tailored to your choices with zero sign-ups or tracking databases.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full sm:w-auto px-7 py-3 text-sm shadow-glow-moss"
            >
              <IconSparkles className="w-4 h-4" />
              Calculate my footprint
            </button>
            <Link
              to="/dashboard"
              className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm"
            >
              Explore dashboard
              <IconChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LOCATION + ENVIRONMENT */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <GlassCard className="p-6 sm:p-7 border-moss-500/25">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <p className="section-eyebrow">Local Atmospheric Context</p>
              <h2 className="font-display text-lg font-semibold text-bark-200">
                Weather & Air Quality
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip text-[10px] text-bark-400">
                {isDefaultLocation ? 'Default Location' : 'Using Your Location'}
              </span>
              <span className="rounded-full bg-carbon-900/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-moss-400 border border-moss-500/20">
                Live Feed
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base">📍</span>
                <span className="font-semibold text-sm text-bark-100">
                  {locationInfo?.formattedName || 'Kolkata, West Bengal'}
                </span>
                {isDefaultLocation && (
                  <span className="chip text-[10px] py-0 px-2 text-bark-400 border-white/10 bg-white/[0.04]">
                    Default location
                  </span>
                )}
              </div>
              <p className="text-xs text-bark-400">
                {isDefaultLocation
                  ? 'Indian CEA power grid baseline & regional telemetry active. Location access is optional.'
                  : 'Localized telemetry active for your detected area.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseLocation}
              disabled={isRequesting}
              className="btn-secondary text-xs py-2 px-4 shrink-0 w-full md:w-auto"
            >
              {isRequesting ? 'Detecting...' : isDefaultLocation ? 'Use my location' : 'Change / Update location'}
            </button>
          </div>

          {/* Telemetry metrics strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider text-bark-400">
                <IconBolt className="w-3.5 h-3.5 text-moss-400" />
                <span>Weather</span>
              </div>
              <p className="mt-1 font-semibold text-sm text-bark-200">
                {weather && typeof weather.temperature === 'number'
                  ? `${weather.temperature.toFixed(0)}°C · ${weather.condition || 'Fair'}`
                  : 'Weather unavailable'}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider text-bark-400">
                <IconLeaf className="w-3.5 h-3.5 text-moss-400" />
                <span>Air Quality</span>
              </div>
              <p className="mt-1 font-semibold text-sm text-moss-300">
                {airQuality?.aqiLevel?.label ? `AQI ${airQuality.aqiLevel.label}` : 'Air quality data unavailable'}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] uppercase font-mono tracking-wider text-bark-400">
                <IconTarget className="w-3.5 h-3.5 text-lichen-400" />
                <span>Grid Baseline</span>
              </div>
              <p className="mt-1 font-semibold text-xs text-bark-200">
                0.713 kg CO₂e/kWh (CEA v19)
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 3. WHAT CARBONWISE HELPS YOU UNDERSTAND */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow">Comprehensive Coverage</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
            What CarbonWise Helps You Understand
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-bark-400 leading-relaxed">
            Personal emissions come from a few distinct daily habits. CarbonWise quantifies each category independently using verified methodology.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25">
              <IconCar className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-bark-200">🚗 Transport</h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Personal vehicle commutes, public bus routes, metro/train journeys, cycling, and walking footprint.
            </p>
            <div className="mt-4 text-[11px] font-mono text-moss-300/90">
              0 to 0.184 kg CO₂e / km
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lichen-500/15 text-lichen-400 ring-1 ring-lichen-500/25">
              <IconBolt className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-bark-200">⚡ Electricity</h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Household energy consumption tiers mapped to regional grid emission intensity factors.
            </p>
            <div className="mt-4 text-[11px] font-mono text-lichen-300/90">
              0.713 kg CO₂e / kWh
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25">
              <IconPlate className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-bark-200">🍽️ Lifestyle / Diet</h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Daily dietary footprint comparing vegetarian, mixed, and animal-forward meal patterns.
            </p>
            <div className="mt-4 text-[11px] font-mono text-moss-300/90">
              1.5 to 5.0 kg CO₂e / day
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lichen-500/15 text-lichen-400 ring-1 ring-lichen-500/25">
              <IconBottle className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-bark-200">♻️ Packaging & Plastics</h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Single-use plastics, packaging consumption, and low-waste lifestyle habits.
            </p>
            <div className="mt-4 text-[11px] font-mono text-lichen-300/90">
              0.3 to 1.8 kg CO₂e / day
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow">Clear & Simple Flow</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-bark-400 leading-relaxed">
            Get an accurate snapshot of your emissions and immediate steps for improvement in four straightforward stages.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 relative">
            <span className="font-mono text-xs font-bold text-moss-400">01</span>
            <h3 className="mt-3 font-display text-base font-semibold text-bark-200">
              Tell us about your routine
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Select your typical commute mode, energy usage level, meal preference, and packaging habits.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 relative">
            <span className="font-mono text-xs font-bold text-moss-400">02</span>
            <h3 className="mt-3 font-display text-base font-semibold text-bark-200">
              Get an estimated CO₂e footprint
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              CarbonWise calculates your daily estimated emissions in kg CO₂e with full mathematical transparency.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 relative">
            <span className="font-mono text-xs font-bold text-moss-400">03</span>
            <h3 className="mt-3 font-display text-base font-semibold text-bark-200">
              See what's contributing most
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Interactive category breakdowns highlight your single largest emission contributor.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 relative">
            <span className="font-mono text-xs font-bold text-moss-400">04</span>
            <h3 className="mt-3 font-display text-base font-semibold text-bark-200">
              Find practical ways to reduce it
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-bark-400">
              Receive prioritized action swaps and tailored challenges to lower your footprint over time.
            </p>
          </div>
        </div>
      </section>

      {/* 5. YOUR FOOTPRINT, EXPLAINED */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="section-eyebrow">Interactive Insights</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
              Your Footprint, Explained
            </h2>
            <p className="mt-3 text-sm text-bark-300 leading-relaxed">
              Instead of an abstract number, CarbonWise breaks your carbon score down into understandable, proportional categories and historical comparisons.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-moss-400 font-bold">✓</span>
                <p className="text-xs text-bark-300"><b>Proportional Breakdown:</b> Understand exact kg contributions from transport vs. energy vs. food.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-moss-400 font-bold">✓</span>
                <p className="text-xs text-bark-300"><b>Top Category Identification:</b> Pinpoints the largest opportunity for measurable reduction.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-moss-400 font-bold">✓</span>
                <p className="text-xs text-bark-300"><b>Day-over-Day Trends:</b> Track progress across 7-day rolling averages and streak counters.</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-moss-300 hover:text-moss-200 transition-colors"
              >
                <span>View my dashboard</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Preview Mockup Card */}
          <GlassCard className="p-6 border-moss-500/30 shadow-glow-moss">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-moss-400" />
                <span className="font-display text-sm font-semibold text-bark-200">Sample Footprint Preview</span>
              </div>
              <span className="chip text-[10px] text-moss-400 border-moss-500/30 bg-moss-500/10">Moderate Impact</span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-bark-400">Total Estimated CO₂e</span>
                <span className="font-mono text-2xl font-bold text-moss-400">
                  {today?.score ? `${today.score.toFixed(1)} kg` : '11.7 kg'} <span className="text-xs text-bark-400 font-normal">/ day</span>
                </span>
              </div>

              <div className="rounded-xl bg-white/[0.02] p-3.5 border border-white/[0.06] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-bark-300">🚗 Transport (Solo Car)</span>
                  <span className="font-mono text-bark-200 font-semibold">4.6 kg (39%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full bg-moss-400 rounded-full w-[39%]" />
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-bark-300">⚡ Electricity (Medium Grid)</span>
                  <span className="font-mono text-bark-200 font-semibold">3.0 kg (26%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full bg-lichen-400 rounded-full w-[26%]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-bark-400 pt-1">
                <span>Recent Comparison:</span>
                <span className="font-mono text-moss-400 font-semibold">▼ -1.2 kg CO₂e decrease</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 6. SMALL CHANGES, REAL PROGRESS */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 border-t border-white/[0.06] text-center">
        <div className="rounded-3xl border border-moss-500/25 bg-moss-500/[0.04] p-8 sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-500/15 text-moss-400 mb-4 ring-1 ring-moss-500/30">
            <IconLeaf className="w-6 h-6" />
          </span>
          <h2 className="font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
            Small Changes, Real Progress
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-bark-300 max-w-2xl mx-auto">
            CarbonWise is built on the philosophy of sustainable habit formation. We do not promote guilt, shame, or unrealistic perfection. Replacing one solo car trip a week with public transit or choosing a vegetarian lunch creates lasting, compounding positive impact.
          </p>
        </div>
      </section>

      {/* 7. CHALLENGES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-eyebrow">Gamified Habits</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
              Real-World Eco Challenges
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-bark-400">
              Turn small daily decisions into streaks, badge unlocks, and measurable carbon savings.
            </p>
          </div>
          <Link
            to="/challenges"
            className="btn-secondary text-xs py-2 px-4 shrink-0"
          >
            Explore challenges
            <IconChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredChallenges.map((ch) => (
            <GlassCard key={ch.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="chip text-[10px]">{ch.category}</span>
                  <span className="font-mono text-moss-300 font-semibold">+{ch.points} pts</span>
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-bark-200">
                  {ch.title}
                </h3>
                <p className="mt-1.5 text-xs text-bark-400 leading-relaxed">
                  {ch.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] text-moss-400 font-medium">
                ≈ Saves {ch.estimatedSavingsKg} kg CO₂e
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 8. YOUR AI SUSTAINABILITY COACH */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <GlassCard className="p-8 sm:p-10 border-lichen-500/25 bg-lichen-500/[0.03]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lichen-500/15 text-lichen-400 ring-1 ring-lichen-500/30">
                  <IconRobot className="w-5 h-5" />
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lichen-400">
                  AI Sustainability Coach
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-bark-100">
                Have a question about your results?
              </h2>
              <p className="text-sm leading-relaxed text-bark-300">
                Ask the coach for suggestions based on your CarbonWise data. Powered by Gemini via a secure serverless proxy, the coach analyzes your category breakdown and local weather to suggest high-impact habit swaps.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-primary shrink-0 py-3 px-6 text-sm shadow-glow-moss"
            >
              <IconSparkles className="w-4 h-4" />
              Try AI Coach
            </button>
          </div>
        </GlassCard>
      </section>

      {/* 9. HOW WE CALCULATE */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-eyebrow">Methodological Rigor</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
            How We Calculate
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-bark-400 leading-relaxed">
            All calculations adhere to international GHG Protocol standards using verified activity emission baselines.
          </p>
        </div>

        <div className="rounded-2xl border border-moss-500/30 bg-carbon-900/80 p-6 sm:p-8 text-center space-y-4">
          <div className="inline-block rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-4">
            <p className="font-mono text-base sm:text-lg font-bold text-moss-300">
              Activity Data × Verified Emission Factor = Estimated Emissions
            </p>
          </div>
          <p className="text-xs text-bark-300 max-w-xl mx-auto leading-relaxed">
            * <b>These are estimates, not exact measurements.</b> We use standard factors from the Central Electricity Authority (CEA India CO₂ Database v19, 2024), UK DEFRA, ARAI, and Our World in Data to give reliable comparative feedback.
          </p>
        </div>
      </section>

      {/* 10. PRIVACY / NO ACCOUNT */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 border-t border-white/[0.06]">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-moss-500/30 bg-moss-500/10 px-3 py-1 text-xs text-moss-300 mb-3">
              <IconShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Tracking Privacy</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-bark-100 sm:text-3xl">
              No Account Required.
            </h2>
            <p className="mt-3 text-sm text-bark-300 leading-relaxed">
              CarbonWise is built local-first. We do not store your data on remote servers or track your identity across sessions.
            </p>
          </div>

          <div className="space-y-3 text-xs text-bark-300">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3">
              <IconCheck className="w-4 h-4 text-moss-400 mt-0.5 shrink-0" />
              <p><b>Local Storage Exclusively:</b> All calculations, challenges, streaks, and personal targets remain stored in your browser.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3">
              <IconCheck className="w-4 h-4 text-moss-400 mt-0.5 shrink-0" />
              <p><b>Optional Geolocation:</b> Location is requested only on-demand to fetch local weather and air quality. If declined, Kolkata defaults apply smoothly.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start gap-3">
              <IconCheck className="w-4 h-4 text-moss-400 mt-0.5 shrink-0" />
              <p><b>Full Data Ownership:</b> Download your complete carbon log anytime as a JSON backup or CSV spreadsheet directly from Settings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 text-center border-t border-white/[0.06]">
        <GlassCard className="p-10 sm:p-12 border-moss-500/35 shadow-glow-moss">
          <h2 className="font-display text-3xl font-semibold text-bark-100 sm:text-4xl">
            Ready to see where your footprint comes from?
          </h2>
          <p className="mt-4 text-sm text-bark-300 max-w-xl mx-auto leading-relaxed">
            Answer four simple daily routine questions to get your instant carbon estimate and personalized action swaps.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-primary px-8 py-3.5 text-sm shadow-glow-moss"
            >
              <IconSparkles className="w-4 h-4" />
              Calculate my footprint
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </section>
    </PageLayout>
  )
}
