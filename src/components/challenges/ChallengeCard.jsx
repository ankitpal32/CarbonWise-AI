import GlassCard from '../common/GlassCard'
import { IconCheck } from '../common/Icons'

export default function ChallengeCard({ challenge, completed, onToggle }) {
  return (
    <GlassCard
      className={`flex flex-col justify-between p-5 transition-all duration-300 ${
        completed ? 'border-moss-500/30 bg-moss-500/[0.05]' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="chip">{challenge.category}</span>
          <span className="font-mono text-xs font-semibold text-lichen-400">+{challenge.points} pts</span>
        </div>
        <h3 className="mt-3 font-display text-base font-semibold text-bark-200">{challenge.title}</h3>
        <p className="mt-1.5 text-sm text-bark-400">{challenge.description}</p>
      </div>

      <button
        onClick={() => onToggle(challenge.id, challenge.points)}
        className={`mt-5 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
          completed
            ? 'bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/30'
            : 'bg-white/[0.04] text-bark-200 ring-1 ring-white/10 hover:bg-white/[0.07]'
        }`}
      >
        {completed && <IconCheck className="w-4 h-4" />}
        {completed ? 'Completed' : 'Mark as Done'}
      </button>
    </GlassCard>
  )
}
