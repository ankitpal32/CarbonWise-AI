import GlassCard from '../common/GlassCard'
import LeafGauge from '../dashboard/LeafGauge'
import { getRecommendations } from '../../data/carbonData'
import { IconCar, IconBolt, IconPlate, IconBottle, IconSparkles } from '../common/Icons'

const BREAKDOWN_META = [
  { key: 'transport', label: 'Transportation', icon: <IconCar className="w-4 h-4" /> },
  { key: 'electricity', label: 'Electricity', icon: <IconBolt className="w-4 h-4" /> },
  { key: 'food', label: 'Food', icon: <IconPlate className="w-4 h-4" /> },
  { key: 'plastic', label: 'Plastic', icon: <IconBottle className="w-4 h-4" /> },
]

export default function ResultPanel({ entry, onOpenCoach }) {
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
      </GlassCard>

      <div className="grid gap-6">
        <GlassCard className="p-6">
          <p className="section-eyebrow">Breakdown</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Where it's coming from</h3>
          <div className="mt-5 space-y-4">
            {BREAKDOWN_META.map((m) => {
              const val = entry.breakdown[m.key]
              const pct = (val / maxVal) * 100
              return (
                <div key={m.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-bark-300">
                      <span className="text-moss-400">{m.icon}</span>
                      {m.label}
                    </span>
                    <span className="font-mono text-xs text-bark-400">{val.toFixed(1)} kg</span>
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
            <button onClick={onOpenCoach} className="btn-secondary hidden sm:inline-flex">
              <IconSparkles className="w-4 h-4 text-lichen-400" />
              Ask AI Coach
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {recommendations.map((rec) => (
              <li key={rec.id} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="chip shrink-0">{rec.category}</span>
                <span className="text-sm text-bark-300">{rec.text}</span>
              </li>
            ))}
          </ul>
          <button onClick={onOpenCoach} className="btn-primary mt-5 w-full sm:hidden">
            <IconSparkles className="w-4 h-4" />
            Ask AI Coach
          </button>
        </GlassCard>
      </div>
    </div>
  )
}
