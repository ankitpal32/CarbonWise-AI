import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import GlassCard from '../components/common/GlassCard'
import {
  IconLeaf,
  IconTarget,
  IconSparkles,
  IconAward,
  IconClose,
} from '../components/common/Icons'
import { getAllEmissionFactors, FACTOR_VERSION } from '../data/emissionFactors'
import { useCarbonData } from '../hooks/useCarbonData'

const METHOD_STEPS = [
  {
    icon: IconTarget,
    title: '1. Activity Data Collection',
    desc: 'You log your daily choices across transportation, household electricity, diet, and single-use packaging — the four primary levers of individual carbon impact.',
  },
  {
    icon: IconLeaf,
    title: '2. GHG Protocol Activity × Factor Model',
    desc: 'Each activity is multiplied by a verified emission factor (kg CO₂e per km, kWh, meal, or packaging item) sourced from government and academic databases.',
  },
  {
    icon: IconSparkles,
    title: '3. Local & Context-Aware Insights',
    desc: 'Regional factors (e.g. Indian Central Electricity Authority grid intensity) and local atmospheric data help personalize the reduction guidance.',
  },
  {
    icon: IconAward,
    title: '4. Targeted Habit Formation',
    desc: 'The Reduction Planner isolates your largest emission category and links actionable swaps directly to daily challenges and streak rewards.',
  },
]

export default function About() {
  const { resetData } = useCarbonData()
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const factors = getAllEmissionFactors()

  const handleReset = () => {
    resetData()
    setShowConfirmReset(false)
    setResetSuccess(true)
    setTimeout(() => setResetSuccess(false), 4000)
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center">
          <p className="section-eyebrow">Methodology & Science</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
            Carbon Calculation Methodology
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-bark-400 sm:text-base">
            Understand how CarbonWise AI calculates your daily carbon footprint (kg CO₂e) using the GHG Protocol activity-factor framework.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="chip text-[11px] font-mono border-moss-500/30 bg-moss-500/10 text-moss-300">
              Factor Registry: Version {FACTOR_VERSION}
            </span>
          </div>
        </header>

        {/* Core Calculation Framework */}
        <section className="mb-12">
          <GlassCard className="p-6 sm:p-7 border-moss-500/20">
            <h2 className="font-display text-xl font-semibold text-bark-200">
              The Calculation Model
            </h2>
            <p className="mt-2 text-xs text-bark-300 leading-relaxed">
              In alignment with the <b>Greenhouse Gas Protocol (GHG Protocol)</b> Corporate and Individual Scope 3 standards, CarbonWise AI applies the fundamental linear calculation model:
            </p>

            <div className="mt-4 rounded-xl border border-white/[0.08] bg-carbon-900/80 p-4 font-mono text-xs text-moss-300 text-center">
              Estimated Emissions (kg CO₂e) = Activity Data × Verified Emission Factor
            </div>

            <p className="mt-3 text-[11px] text-bark-400 leading-relaxed">
              All categories are expressed in <b>kilograms of carbon dioxide equivalent (kg CO₂e)</b>, accounting for the global warming potential of CO₂, methane (CH₄), and nitrous oxide (N₂O) normalized over a 100-year time horizon.
            </p>
          </GlassCard>
        </section>

        {/* 4 Steps */}
        <section className="mb-12">
          <h2 className="mb-5 font-display text-xl font-semibold text-bark-200">
            How the System Works
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {METHOD_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <GlassCard key={step.title} className="p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-moss-500/12 text-moss-400 ring-1 ring-moss-500/20">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-bark-200">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-bark-400">
                    {step.desc}
                  </p>
                </GlassCard>
              )
            })}
          </div>
        </section>

        {/* Central Emission Factors Registry Table */}
        <section className="mb-12">
          <GlassCard className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-bark-200">
                  Verified Emission Factor Registry
                </h2>
                <p className="mt-0.5 text-xs text-bark-400">
                  Authoritative benchmarks from Indian regulatory bodies and international standards.
                </p>
              </div>
              <span className="chip text-[10px]">India-First Design</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-bark-300">
                <thead>
                  <tr className="border-b border-white/10 text-bark-400">
                    <th className="pb-2.5 font-semibold">Activity</th>
                    <th className="pb-2.5 font-semibold">Assumed Value</th>
                    <th className="pb-2.5 font-semibold">Factor & Unit</th>
                    <th className="pb-2.5 font-semibold">Daily Estimate</th>
                    <th className="pb-2.5 font-semibold">Primary Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {factors.map((f) => (
                    <tr key={f.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-medium text-bark-200">
                        {f.activity}
                        {f.isIndiaSpecific && (
                          <span className="ml-1.5 inline-block text-[9px] font-mono text-moss-400 font-normal">
                            [India]
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-bark-400">{f.assumedActivityValue} {f.activityUnit}</td>
                      <td className="py-3 font-mono text-moss-300">{f.factor} {f.factorUnit}</td>
                      <td className="py-3 font-mono font-semibold text-bark-100">{f.dailyKgCO2e.toFixed(1)} kg</td>
                      <td className="py-3 text-bark-400 text-[11px]">
                        {f.sourceUrl ? (
                          <a
                            href={f.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:text-moss-400 hover:underline"
                          >
                            {f.source.split('(')[0].trim()} ({f.year})
                          </a>
                        ) : (
                          `${f.source} (${f.year})`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>

        {/* Uncertainty & Estimation Language */}
        <section className="mb-12">
          <GlassCard className="p-6">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              Understanding Estimation Limits
            </h2>
            <div className="mt-3 space-y-2.5 text-xs leading-relaxed text-bark-300">
              <p>
                <b>Estimation Tool:</b> CarbonWise AI is designed as a personal awareness and habit-formation tool, not a certified carbon audit or regulatory compliance accounting instrument.
              </p>
              <p>
                <b>Regional Grid Variations:</b> Indian electricity grid intensity is calibrated against the Central Electricity Authority (CEA) National Grid weighted average (~0.713 kg CO₂e/kWh). Actual emissions fluctuate dynamically by season and state-level power generation mix.
              </p>
              <p>
                <b>Diet & Lifecycle Boundaries:</b> Dietary estimates reflect average cradle-to-retail lifecycle benchmarks from meta-analyses (Poore & Nemecek, Science). Individual agricultural practices, transport distances, and food prep methods naturally introduce variance.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Data Reset */}
        <section className="mb-12">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-semibold text-bark-200">
                  Data Reset & Privacy
                </h2>
                <p className="mt-1 text-xs text-bark-400">
                  Clear all your local logs, active streaks, and badge points from this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="rounded-full border border-signal-bad/40 bg-signal-bad/10 px-4 py-2 text-xs font-semibold text-signal-bad hover:bg-signal-bad/20 transition-colors"
              >
                Reset My Data
              </button>
            </div>

            {resetSuccess && (
              <p className="mt-3 text-xs text-moss-400 animate-rise" role="status">
                ✓ All local data and history have been successfully reset.
              </p>
            )}
          </GlassCard>
        </section>

        {/* Reset Confirmation Modal */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/80 p-4 backdrop-blur-sm animate-rise">
            <GlassCard className="w-full max-w-md p-6 shadow-glow-moss" role="dialog" aria-modal="true">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg font-semibold text-bark-200">
                  Reset All CarbonWise Data?
                </h3>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="text-bark-400 hover:text-bark-200"
                  aria-label="Close"
                >
                  <IconClose className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-xs text-bark-300 leading-relaxed">
                This will clear all your logged daily footprints, completed challenges, streaks, and badge points from this browser.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-signal-bad px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
