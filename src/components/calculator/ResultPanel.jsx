<<<<<<< HEAD
import { useState } from 'react'
import GlassCard from '../common/GlassCard'
import LeafGauge from '../dashboard/LeafGauge'
import { getRecommendations, getCalculationDetails, FACTOR_VERSION } from '../../data/carbonData'
import { IconCar, IconBolt, IconPlate, IconBottle, IconSparkles, IconClose } from '../common/Icons'
=======
import GlassCard from '../common/GlassCard'
import LeafGauge from '../dashboard/LeafGauge'
import { getRecommendations } from '../../data/carbonData'
import { IconCar, IconBolt, IconPlate, IconBottle, IconSparkles } from '../common/Icons'
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882

const BREAKDOWN_META = [
  { key: 'transport', label: 'Transportation', icon: <IconCar className="w-4 h-4" /> },
  { key: 'electricity', label: 'Electricity', icon: <IconBolt className="w-4 h-4" /> },
  { key: 'food', label: 'Food', icon: <IconPlate className="w-4 h-4" /> },
  { key: 'plastic', label: 'Plastic', icon: <IconBottle className="w-4 h-4" /> },
]

export default function ResultPanel({ entry, onOpenCoach }) {
<<<<<<< HEAD
  const [showFormulaModal, setShowFormulaModal] = useState(false)

  if (!entry || !entry.breakdown) return null
  const recommendations = getRecommendations(entry.inputs)
  const calculationDetails = getCalculationDetails(entry.inputs)
  const maxVal = Math.max(...BREAKDOWN_META.map((m) => entry.breakdown[m.key] || 0), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] animate-rise">
      <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
        <LeafGauge score={entry.score || 0} />
        <p className="mt-4 text-xs text-bark-400">
          Estimated daily carbon footprint in kg CO₂e
        </p>

        {/* How is this calculated trigger */}
        <button
          type="button"
          onClick={() => setShowFormulaModal(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-moss-300 hover:border-moss-500/40 hover:bg-white/[0.06] transition-all"
        >
          <span>ℹ️</span> How is this calculated?
        </button>
=======
  if (!entry) return null
  const recommendations = getRecommendations(entry.inputs)
  const maxVal = Math.max(...BREAKDOWN_META.map((m) => entry.breakdown[m.key]), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] animate-rise">
      <GlassCard className="flex flex-col items-center justify-center p-6">
        <LeafGauge score={entry.score} />
        <p className="mt-4 text-center text-sm text-bark-400">
          Today's footprint based on your inputs
        </p>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
      </GlassCard>

      <div className="grid gap-6">
        <GlassCard className="p-6">
<<<<<<< HEAD
          <div className="flex items-center justify-between">
            <div>
              <p className="section-eyebrow">Breakdown</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Where it's coming from</h3>
            </div>
            <span className="chip text-[10px] font-mono">
              Factor Set: v{entry.factorVersion || FACTOR_VERSION}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {BREAKDOWN_META.map((m) => {
              const val = entry.breakdown[m.key] || 0
              const pct = Math.min(100, (val / maxVal) * 100)
=======
          <p className="section-eyebrow">Breakdown</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Where it's coming from</h3>
          <div className="mt-5 space-y-4">
            {BREAKDOWN_META.map((m) => {
              const val = entry.breakdown[m.key]
              const pct = (val / maxVal) * 100
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
              return (
                <div key={m.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-bark-300">
                      <span className="text-moss-400">{m.icon}</span>
                      {m.label}
                    </span>
<<<<<<< HEAD
                    <span className="font-mono text-xs text-bark-400">{val.toFixed(1)} kg CO₂e</span>
=======
                    <span className="font-mono text-xs text-bark-400">{val.toFixed(1)} kg</span>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-moss-600 to-moss-400 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-eyebrow">Recommendations</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">
                Personalized for today's choices
              </h3>
            </div>
<<<<<<< HEAD
            <button
              type="button"
              onClick={onOpenCoach}
              className="btn-secondary hidden sm:inline-flex"
            >
=======
            <button onClick={onOpenCoach} className="btn-secondary hidden sm:inline-flex">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
              <IconSparkles className="w-4 h-4 text-lichen-400" />
              Ask AI Coach
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {recommendations.map((rec) => (
<<<<<<< HEAD
              <li key={rec.id} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <span className="chip shrink-0">{rec.category}</span>
                <span className="text-sm leading-relaxed text-bark-300">{rec.text}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpenCoach}
            className="btn-primary mt-5 w-full sm:hidden"
          >
=======
              <li key={rec.id} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="chip shrink-0">{rec.category}</span>
                <span className="text-sm text-bark-300">{rec.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={onOpenCoach} className="btn-primary mt-5 w-full sm:hidden">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            <IconSparkles className="w-4 h-4" />
            Ask AI Coach
          </button>
        </GlassCard>
      </div>
<<<<<<< HEAD

      {/* Calculation Transparency Modal */}
      {showFormulaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/80 p-4 backdrop-blur-sm animate-rise"
          onClick={() => setShowFormulaModal(false)}
        >
          <GlassCard
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-glow-moss"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Calculation Transparency Details"
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <p className="section-eyebrow">GHG Protocol Methodology</p>
                <h3 className="font-display text-xl font-semibold text-bark-200">
                  How your footprint is calculated
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulaModal(false)}
                className="rounded-lg p-1.5 text-bark-400 hover:text-bark-200"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-bark-300">
              <div className="rounded-xl border border-moss-500/25 bg-moss-500/[0.06] p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-moss-300 font-semibold">
                  Standard GHG Formula
                </p>
                <p className="mt-1 font-mono text-sm text-bark-100">
                  Estimated CO₂e = Activity Data × Verified Emission Factor
                </p>
                <p className="mt-1.5 text-[11px] text-bark-400 leading-relaxed">
                  Sum of individual category estimates across daily transportation, household electricity, diet, and lifestyle packaging.
                </p>
              </div>

              <div className="space-y-3">
                {calculationDetails.map((item) => (
                  <div key={item.key} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-bark-200">{item.category}</span>
                      <span className="font-mono font-semibold text-moss-300">{item.estimatedKg.toFixed(2)} kg CO₂e</span>
                    </div>

                    <div className="mt-2 rounded-lg bg-carbon-900/80 p-2.5 font-mono text-[11px] text-bark-300 border border-white/[0.04]">
                      {item.formula}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-bark-400">
                      <span>Scope/Region: <b className="text-bark-300">{item.region}</b></span>
                      <span>Source: <b className="text-bark-300">{item.source} ({item.year})</b></span>
                    </div>
                    {item.notes && (
                      <p className="mt-1.5 text-[11px] text-bark-400/80 italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center justify-between font-mono">
                <span className="font-semibold text-bark-200">Total Estimated Daily Footprint:</span>
                <span className="text-sm font-bold text-moss-300">{entry.score.toFixed(2)} kg CO₂e/day</span>
              </div>

              <p className="text-[11px] text-bark-400/80 leading-relaxed">
                *Disclaimer: CarbonWise AI provides comparative estimates based on published research and government baselines (CEA India, UK DEFRA, US EPA, Our World in Data) to build intuition for personal habit formation, not certified corporate GHG audits.
              </p>
            </div>
          </GlassCard>
        </div>
      )}
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
    </div>
  )
}
