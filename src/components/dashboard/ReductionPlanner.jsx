import { Link } from 'react-router-dom'
import GlassCard from '../common/GlassCard'
import { getReductionPlan } from '../../data/carbonData'
import { IconCar, IconBolt, IconPlate, IconBottle, IconCheck, IconChevronRight, IconSparkles } from '../common/Icons'

const ICONS = {
  car: <IconCar className="w-5 h-5" />,
  bolt: <IconBolt className="w-5 h-5" />,
  plate: <IconPlate className="w-5 h-5" />,
  bottle: <IconBottle className="w-5 h-5" />,
}

export default function ReductionPlanner({ breakdown, completedChallenges = {}, onToggleChallenge }) {
  if (!breakdown) return null

  const plan = getReductionPlan(breakdown)
  const IconComponent = ICONS[plan.icon] || <IconCar className="w-5 h-5" />

  return (
    <GlassCard className="p-6 animate-rise border-moss-500/20">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
        <div>
          <p className="section-eyebrow">Reduction Planner</p>
          <h3 className="font-display text-lg font-semibold text-bark-200">
            How can you reduce it?
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-moss-500/30 bg-moss-500/10 px-3 py-1 text-xs text-moss-300">
          <span className="text-moss-400">{IconComponent}</span>
          <span>Largest Contributor: <b>{plan.largestLabel}</b> ({plan.largestValue.toFixed(1)} kg)</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-xs text-bark-400">
          Targeting your top emission area delivers the fastest daily impact reductions:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {plan.actions.map((action, idx) => {
            const isCompleted = Boolean(completedChallenges[action.challengeId])

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-200 hover:border-moss-500/30 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="chip text-[10px]">Action {idx + 1}</span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-moss-400">
                        <IconCheck className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-bark-200 font-medium">
                    {action.text}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-white/[0.05]">
                  {action.challengeId && onToggleChallenge ? (
                    <button
                      type="button"
                      onClick={() => onToggleChallenge(action.challengeId, 15)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'border border-moss-500/40 bg-moss-500/15 text-moss-300'
                          : 'btn-secondary text-xs w-full justify-center'
                      }`}
                    >
                      {isCompleted ? 'Challenge Completed ✓' : 'Mark as Challenge Done'}
                    </button>
                  ) : (
                    <Link
                      to="/challenges"
                      className="inline-flex items-center gap-1 text-xs text-moss-400 hover:underline"
                    >
                      Explore Challenges <IconChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}
