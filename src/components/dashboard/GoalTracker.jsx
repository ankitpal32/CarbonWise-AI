import { useState } from 'react'
import GlassCard from '../common/GlassCard'
import { IconTarget, IconCheck, IconSparkles } from '../common/Icons'

export default function GoalTracker({ currentScore = 0, goal, onSaveGoal }) {
  const [editing, setEditing] = useState(!goal || !goal.enabled)
  const [percent, setPercent] = useState(goal?.targetPercent || 15)

  const hasGoal = goal && goal.enabled && typeof goal.targetPercent === 'number'
  const baseScore = goal?.baseScore || currentScore || 10
  const targetKg = baseScore * (1 - percent / 100)

  // Calculate progress: if currentScore <= targetKg, 100% achieved
  // Progress formula: how much of the needed reduction has been achieved
  const neededReduction = baseScore - targetKg
  const currentReduction = Math.max(0, baseScore - currentScore)
  const progressPercent = neededReduction > 0
    ? Math.min(100, Math.max(0, Math.round((currentReduction / neededReduction) * 100)))
    : (currentScore <= targetKg ? 100 : 0)

  const handleSave = () => {
    onSaveGoal({
      enabled: true,
      targetPercent: percent,
      baseScore: currentScore || 10,
      targetKg: +(currentScore * (1 - percent / 100)).toFixed(1),
    })
    setEditing(false)
  }

  const handleClear = () => {
    onSaveGoal({ enabled: false })
    setEditing(true)
  }

  return (
    <GlassCard className="p-6 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lichen-500/15 text-lichen-400 ring-1 ring-lichen-500/25">
            <IconTarget className="w-4 h-4" />
          </span>
          <div>
            <p className="section-eyebrow">Personal Target</p>
            <h3 className="font-display text-base font-semibold text-bark-200">
              Daily Reduction Goal
            </h3>
          </div>
        </div>

        {hasGoal && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-bark-400 hover:text-moss-400 underline-offset-2 hover:underline"
          >
            Adjust Goal
          </button>
        )}
      </div>

      {!editing && hasGoal ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-bark-300">
              Target: <b className="text-lichen-400">-{goal.targetPercent}% reduction</b> (≤ {typeof goal.targetKg === 'number' && Number.isFinite(goal.targetKg) ? goal.targetKg.toFixed(1) : '—'} kg CO₂e/day)
            </span>
            <span className="font-mono text-moss-300 font-semibold">
              {progressPercent}% on track
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-moss-500 to-lichen-400 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-bark-400">
            <span>Baseline: {typeof goal.baseScore === 'number' && Number.isFinite(goal.baseScore) ? `${goal.baseScore.toFixed(1)} kg` : '—'}</span>
            <span>Today: {typeof currentScore === 'number' && currentScore > 0 ? `${currentScore.toFixed(1)} kg` : 'Not logged'}</span>
            <span>Target: {typeof goal.targetKg === 'number' && Number.isFinite(goal.targetKg) ? `${goal.targetKg.toFixed(1)} kg` : '—'}</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <p className="text-xs text-bark-300">
            Set an achievable daily target to build sustainable momentum over time:
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {[10, 15, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercent(pct)}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  percent === pct
                    ? 'border-lichen-500/50 bg-lichen-500/10 text-lichen-300 ring-1 ring-lichen-500/30 font-semibold'
                    : 'border-white/[0.07] bg-white/[0.02] text-bark-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="block text-sm font-bold">-{pct}%</span>
                <span className="block text-[10px] text-bark-400">
                  ≈ {(currentScore > 0 ? currentScore * (1 - pct / 100) : 10 * (1 - pct / 100)).toFixed(1)} kg/day
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary text-xs flex-1 py-2"
            >
              <IconCheck className="w-3.5 h-3.5" />
              Set Goal Target
            </button>
            {hasGoal && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary text-xs py-2"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  )
}
